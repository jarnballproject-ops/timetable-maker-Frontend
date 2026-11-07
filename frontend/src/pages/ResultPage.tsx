import React from 'react';
import { Card } from '../components/ui/Card';
import { useStore } from '../state/useStore';
import { NavLink } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TimetableGrid } from '../components/TimetableGrid';
import { AlertCircle, CheckCircle2, Calendar, AlertTriangle, Scale } from 'lucide-react';

export const ResultPage: React.FC = () => {
  const schedule = useStore('currentSchedule');
  const report = useStore('currentReport');
  const problem = useStore('problem');

  if (!schedule || !report || !problem) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          padding: 'var(--space-12)',
        }}
      >
        <Card
          title="ผลลัพธ์การประมวลผล"
          style={{
            maxWidth: '550px',
            textAlign: 'center' as const,
            borderRadius: '32px',
            padding: 'var(--space-16)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: '64px',
              marginBottom: 'var(--space-8)',
              opacity: 0.5,
              filter: 'grayscale(1)',
            }}
          >
            <Calendar size={64} />
          </div>
          <h2
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '700',
              marginBottom: 'var(--space-4)',
              color: 'var(--text-primary)',
            }}
          >
            ยังไม่พบตารางเรียน
          </h2>
          <p
            style={{
              color: '#64748B',
              fontSize: 'var(--font-size-md)',
              lineHeight: '1.6',
              marginBottom: 'var(--space-10)',
            }}
          >
            ระบบยังไม่มีข้อมูลการประมวลผลในขณะนี้
            <br />
            กรุณากลับไปที่หน้าประมวลผลเพื่อเริ่มสร้างตารางเรียน
          </p>
          <NavLink
            to="/solve"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              backgroundColor: 'var(--accent)',
              color: 'white',
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(21, 128, 61, 0.2)',
            }}
          >
            กลับไปหน้าประมวลผล
          </NavLink>
        </Card>
      </div>
    );
  }

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
      {/* Hero Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 'var(--space-4)',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
              margin: 0,
            }}
          >
            ตารางเรียนของคุณ
            <br />
            <span style={{ color: 'var(--accent)' }}>พร้อมใช้งานแล้ว! ✨</span>
          </h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-muted)' }}>
            นี่คือผลลัพธ์ที่ AI คำนวณได้จากข้อจำกัดที่คุณกำหนดไว้
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Button
            variant="secondary"
            style={{ height: '56px', borderRadius: '16px', fontWeight: 'bold' }}
          >
            Export PDF
          </Button>
          <Button
            variant="primary"
            style={{ height: '56px', borderRadius: '16px', fontWeight: 'bold' }}
          >
            Export Excel
          </Button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-8)',
          alignItems: 'start',
        }}
      >
        {/* Primary Metrics Bento Grid */}
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <Card
            title="สรุปคุณภาพตารางเรียน"
            style={{
              borderRadius: '32px',
              padding: 'var(--space-8)',
              boxShadow: 'none',
              border: 'none',
              backgroundColor: 'transparent',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {[
                {
                  label: 'การจัดสรรทั้งหมด',
                  value: schedule.assignments.length,
                  unit: 'รายการ',
                  icon: <Calendar size={20} />,
                  color: '#EEF2FF',
                },
                {
                  label: 'Penalty Score',
                  value: report.metrics.penalty,
                  unit: 'คะแนน',
                  icon: <AlertTriangle size={20} />,
                  color: '#FEF2F2',
                },
                {
                  label: 'น้ำหนักรวม',
                  value: report.metrics.weight,
                  unit: 'Weight',
                  icon: <Scale size={20} />,
                  color: '#F0FDF4',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-8)',
                    backgroundColor: item.color,
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-4)',
                    border: '1px solid rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s ease',
                    cursor: 'default',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span
                      style={{
                        fontSize: 'var(--font-size-lg)',
                        padding: '6px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: '#64748B',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                    <span
                      style={{
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {item.value}
                    </span>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: '#94A3B8' }}>
                      {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Violations Feed */}
        <Card
          title="รายการความขัดแย้งที่พบ"
          style={{
            borderRadius: '32px',
            padding: 'var(--space-8)',
            boxShadow: 'none',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {report.violations.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-12)',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '24px',
                  color: '#166534',
                  textAlign: 'center' as const,
                  fontWeight: '700',
                  border: '1px solid #BBF7D0',
                  fontSize: 'var(--font-size-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                }}
              >
                <CheckCircle2 size={32} color="#166534" />
                <div>✨ ยอดเยี่ยม! ไม่พบข้อผิดพลาดในการจัดตาราง (Perfect Schedule)</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {report.violations.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 'var(--space-6)',
                      borderRadius: '20px',
                      backgroundColor: v.severity === 'hard' ? '#FEF2F2' : '#FFFBEB',
                      border: `1px solid ${v.severity === 'hard' ? '#FECACA' : '#FDE68A'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      transition: 'transform 0.2s ease',
                      cursor: 'default',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: v.severity === 'hard' ? '#EF4444' : '#F59E0B',
                        color: 'white',
                      }}
                    >
                      <AlertCircle size={14} />
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-primary)',
                        fontWeight: '500',
                      }}
                    >
                      <b
                        style={{
                          color: v.severity === 'hard' ? '#EF4444' : '#F59E0B',
                          marginRight: 'var(--space-2)',
                        }}
                      >
                        {v.severity === 'hard' ? 'CRITICAL' : 'SOFT'}:
                      </b>
                      {v.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* THE MASTERPIECE: Timetable Grid */}
      <Card
        title="ตารางเรียนฉบับสมบูรณ์"
        subtitle="ข้อมูลการจัดสรรวิชาเรียน รายห้อง และรายอาจารย์"
        style={{ borderRadius: '32px', padding: 'var(--space-8)' }}
      >
        <TimetableGrid schedule={schedule} problem={problem} />
      </Card>
    </div>
  );
};
