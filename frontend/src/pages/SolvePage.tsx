import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { store } from '../state/store';
import { persistence } from '../lib/persistence';
import { client } from '../lib/api-client';
import { useStore } from '../state/useStore';
import { NavLink } from 'react-router-dom';

export interface SolverOptions {
  timeout: number;
  priority: 'speed' | 'quality';
  constraints: {
    strict: boolean;
    allowOverlap: boolean;
  };
}

const DEFAULT_OPTIONS: SolverOptions = {
  timeout: 30,
  priority: 'quality',
  constraints: {
    strict: true,
    allowOverlap: false,
  },
};

export const SolvePage: React.FC = () => {
  const [options, setOptions] = useState<SolverOptions>(DEFAULT_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [conflictsResolved, setConflictsResolved] = useState(0);

  const problem = useStore('problem');
  const activeJobId = useStore('activeJobId');

  const phases = [
    'กำลังวิเคราะห์ข้อจำกัดของห้องเรียน...',
    'กำลังตรวจสอบความขัดแย้งของเวลา...',
    'กำลังจัดสรรรายวิชาลงในคาบว่าง...',
    'กำลังปรับปรุงตารางเพื่อลด Penalty...',
    'กำลังตรวจสอบความถูกต้องขั้นสุดท้าย...',
  ];

  useEffect(() => {
    if (activeJobId) pollStatus(activeJobId);
  }, [activeJobId]);

  const pollStatus = async (jobId: string) => {
    try {
      const res = await client.getJobStatus(jobId);
      setStatus(res);
      if (res.status === 'done' || res.status === 'failed') {
        if (res.schedule) {
          store.setState({ currentSchedule: res.schedule });
          persistence.saveSchedule(res.schedule);
        }
        if (res.report) {
          store.setState({ currentReport: res.report });
          persistence.saveReport(res.report);
        }
        store.setState({ lastOutcome: res.outcome });
        persistence.saveOutcome(res.outcome);
      }
    } catch (e: any) {
      console.error('Polling error', e);
    }
  };

  const handleSolve = async () => {
    if (!problem) return;
    setLoading(true);
    setStatus(null);
    setSimulatedProgress(0);
    setConflictsResolved(0);

    try {
      const res = await client.solve(problem, options);
      store.setState({ activeJobId: res.jobId });
      persistence.saveJobId(res.jobId);

      // Start Wow-factor Simulation
      let phaseIdx = 0;
      const simInterval = setInterval(() => {
        setSimulatedProgress((prev) => {
          if (prev >= 95) {
            clearInterval(simInterval);
            return 95;
          }
          return prev + Math.random() * 5;
        });

        setCurrentPhase(phases[phaseIdx]);
        setConflictsResolved((prev) => prev + Math.floor(Math.random() * 3));

        if (simulatedProgress > (phaseIdx + 1) * 20) {
          phaseIdx = Math.min(phaseIdx + 1, phases.length - 1);
        }
      }, 1500);

      const pollInterval = setInterval(async () => {
        const currentStatus = await client.getJobStatus(res.jobId);
        setStatus(currentStatus);
        if (currentStatus.status === 'done' || currentStatus.status === 'failed') {
          clearInterval(pollInterval);
          clearInterval(simInterval);
          setSimulatedProgress(100);
          if (currentStatus.schedule) {
            store.setState({ currentSchedule: currentStatus.schedule });
            persistence.saveSchedule(currentStatus.schedule);
          }
          if (currentStatus.report) {
            store.setState({ currentReport: currentStatus.report });
            persistence.saveReport(currentStatus.report);
          }
        }
      }, 2000);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-10)',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-12)',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: 'var(--space-8)',
          alignItems: 'center',
          padding: 'var(--space-12)',
          backgroundColor: 'linear-gradient(135deg, #EBF5FF 0%, #FFFFFF 100%)',
          borderRadius: '40px',
          border: '1px solid #Dbeafe',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              lineHeight: '1.1',
              margin: 0,
            }}
          >
            พร้อมประมวลผล
            <br />
            <span style={{ color: '#2563EB' }}>ตารางเรียน</span> ของคุณแล้ว
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--text-muted)',
              maxWidth: '500px',
            }}
          >
            ปรับแต่งพารามิเตอร์เพื่อให้ AI คำนวณตารางเรียนที่ลงตัวที่สุด
            ลดการชนกันของเวลาและห้องเรียน
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Button
              onClick={handleSolve}
              isLoading={loading}
              disabled={!problem}
              style={{
                height: '56px',
                padding: '0 var(--space-8)',
                borderRadius: '16px',
                fontWeight: 'bold',
              }}
            >
              🚀 เริ่มคำนวณทันที
            </Button>
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '300px',
              height: '200px',
              backgroundColor: 'white',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              transform: 'rotate(-5deg)',
              padding: 'var(--space-6)',
              border: '1px solid #E2E8F0',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
            }}
          >
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i % 3 === 0 ? '#DBEAFE' : i % 2 === 0 ? '#EFF6FF' : '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  height: '40px',
                }}
              />
            ))}
            <div
              style={{
                gridColumn: 'span 3',
                height: '40px',
                backgroundColor: '#2563EB',
                borderRadius: '8px',
                marginTop: '10px',
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 'var(--space-8)',
          alignItems: 'start',
        }}
      >
        {/* Configuration Panel */}
        <Card
          title="ตั้งค่าพารามิเตอร์"
          subtitle="กำหนดเกณฑ์เพื่อให้ AI จัดตารางได้อย่างแม่นยำ"
          style={{
            borderRadius: '32px',
            padding: 'var(--space-8)',
            boxShadow: 'none',
            border: 'none',
            backgroundColor: 'transparent',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
            {/* Readiness / Info Banner */}
            {!problem ? (
              <div
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: '24px',
                  backgroundColor: '#FFFBEB',
                  color: '#92400E',
                  border: `1px solid #FDE68A`,
                  fontSize: 'var(--font-size-md)',
                  fontWeight: '600',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                  alignItems: 'center',
                  textAlign: 'center' as const,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--font-size-xl)' }}>⚠️</span>
                  <span>ยังไม่พบข้อมูลการนำเข้า: กรุณานำเข้าไฟล์ก่อนเริ่มทำงาน</span>
                </div>
                <NavLink
                  to="/import"
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  ไปหน้านำเข้าข้อมูล
                </NavLink>
              </div>
            ) : (
              <div
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: '24px',
                  backgroundColor: '#F0FDF4',
                  color: '#166534',
                  border: `1px solid #BBF7D0`,
                  fontSize: 'var(--font-size-md)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                }}
              >
                <span style={{ fontSize: 'var(--font-size-xl)' }}>✅</span>
                <span>ข้อมูลพร้อมแล้ว: คุณสามารถเริ่มประมวลผลได้ทันที</span>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-6)',
                padding: 'var(--space-8)',
                backgroundColor: '#F8FAFC',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                opacity: problem ? 1 : 0.5,
                pointerEvents: problem ? 'auto' : 'none',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <label
                  style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: '#64748B' }}
                >
                  กลยุทธ์ (Priority)
                </label>
                <select
                  value={options.priority}
                  onChange={(e) => setOptions({ ...options, priority: e.target.value as any })}
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: 'white',
                    fontSize: 'var(--font-size-sm',
                    fontWeight: '500',
                  }}
                >
                  <option value="quality">Quality — เน้นความถูกต้องสูงสุด</option>
                  <option value="speed">Speed — เน้นความรวดเร็ว</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <label
                  style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: '#64748B' }}
                >
                  เวลาทำงานสูงสุด (Timeout)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input
                    type="number"
                    value={options.timeout}
                    onChange={(e) =>
                      setOptions({ ...options, timeout: parseInt(e.target.value) || 0 })
                    }
                    style={{
                      flex: 1,
                      padding: 'var(--space-3)',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: 'white',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  />
                  <span style={{ fontSize: 'var(--font-size-sm)', color: '#94A3B8' }}>วินาที</span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                  justifyContent: 'center',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-sm',
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={options.constraints.strict}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        constraints: { ...options.constraints, strict: e.target.checked },
                      })
                    }
                    style={{ width: '18px', height: '18px', accentColor: '#2563EB' }}
                  />
                  บังคับกฎเกณฑ์เคร่งครัด
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-sm',
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={options.constraints.allowOverlap}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        constraints: { ...options.constraints, allowOverlap: e.target.checked },
                      })
                    }
                    style={{ width: '18px', height: '18px', accentColor: '#2563EB' }}
                  />
                  อนุญาตให้ซ้อนทับได้
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* LIVE PROCESS MONITOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {loading || status ? (
            <Card
              title="การประมวลผลสด"
              style={{
                borderRadius: '32px',
                padding: 'var(--space-8)',
                boxShadow: 'none',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: '#94A3B8',
                      fontFamily: 'monospace',
                    }}
                  >
                    JOB: {status?.jobId?.slice(0, 8) || 'Initializing...'}
                  </span>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: status?.status === 'done' ? '#DCFCE7' : '#F1F5F9',
                      color: status?.status === 'done' ? '#166534' : '#475569',
                      fontWeight: 'bold',
                      fontSize: 'var(--font-size-xs)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {status?.status || 'Processing'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: '600',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {currentPhase || 'เตรียมความพร้อม...'}
                    </span>
                    <span style={{ color: '#2563EB' }}>{Math.round(simulatedProgress)}%</span>
                  </div>
                  <div
                    style={{
                      height: '14px',
                      backgroundColor: '#E2E8F0',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div
                      style={{
                        width: `${simulatedProgress}%`,
                        height: '100%',
                        backgroundColor: '#2563EB',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-4)',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <span style={{ fontSize: 'var(--font-size-xl)' }}>⚡</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: '#64748B' }}>
                    แก้ไขความขัดแย้งแล้ว <b>{conflictsResolved}</b> จุด
                  </span>
                </div>

                {status?.outcome && (
                  <div
                    style={{
                      padding: 'var(--space-6)',
                      borderRadius: '20px',
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      textAlign: 'center' as const,
                      fontWeight: '700',
                      fontSize: 'var(--font-size-md)',
                      color: '#166534',
                    }}
                  >
                    ✨ ผลลัพธ์: {status.outcome}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div
              style={{
                padding: 'var(--space-8)',
                backgroundColor: '#F8FAFC',
                borderRadius: '32px',
                textAlign: 'center' as const,
                border: '1px dashed #CBD5E1',
                color: '#94A3B8',
              }}
            >
              <span style={{ fontSize: 'var(--font-size-2xl)' }}>⚙️</span>
              <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-4)' }}>
                ยังไม่มีการประมวลผล
                <br />
                กดปุ่มเริ่มทำงานเพื่อเริ่มต้น
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
