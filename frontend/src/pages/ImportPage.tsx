import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { store } from '../state/store';
import { persistence } from '../lib/persistence';
import { client } from '../lib/api-client';
import { useStore } from '../state/useStore';
import { Users, BookOpen, School, Upload, CheckCircle2 } from 'lucide-react';
import { Hero } from '../components/Hero';

export const ImportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ courses: 0, teachers: 0, rooms: 0 });
  const problem = useStore('problem');

  useEffect(() => {
    if (problem) {
      setCounts({
        courses: problem.courses.length,
        teachers: problem.teachers.length,
        rooms: problem.rooms.length,
      });
    }
  }, [problem]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await client.importData(file);
      store.setState({ problem: result.problem });
      persistence.saveProblem(result.problem);
      alert('✨ นำเข้าข้อมูลสำเร็จ!');
    } catch (e: any) {
      alert(`❌ Error: ${e.message}`);
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
        fontFamily: 'var(--font-family)'
      }}
    >
      <Hero
        title="สวัสดีครับ ยินดีต้อนรับ"
        subtitle="เริ่มต้นสร้างตารางเรียนอัจฉริยะ เพียงนำเข้าข้อมูลความต้องการของคุณ แล้วปล่อยให้ AI ของเราจัดการส่วนที่เหลือ"
        ctaText="นำเข้าข้อมูลตอนนี้"
        onCtaClick={() => document.getElementById('file-upload')?.click()}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--space-8)',
        alignItems: 'start'
      }}>
        <Card
          title="อัปโหลดไฟล์ข้อมูล"
          subtitle="รองรับ .json, .xlsx, .xls, .csv, .pdf"
          style={{ borderRadius: '32px', padding: 'var(--space-8)', boxShadow: 'none', border: 'none', backgroundColor: 'transparent' }}
        >
          <div
            style={{
              border: `3px ${file ? 'solid' : 'dashed'} ${file ? 'var(--accent)' : '#E2E8F0'}`,
              borderRadius: '32px',
              padding: 'var(--space-16)',
              textAlign: 'center' as const,
              backgroundColor: file ? '#F0FDF4' : '#F8FAFC',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-6)',
              boxShadow: file ? '0 10px 30px rgba(21, 128, 61, 0.1)' : 'none'
            }}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div style={{
              fontSize: 'var(--font-size-4xl)',
              backgroundColor: 'white',
              padding: 'var(--space-6)',
              borderRadius: '24px',
              boxShadow: '0 10px 15px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Upload size={48} color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: 'var(--font-size-xl)' }}>
                {file ? file.name : 'ลากไฟล์มาวางที่นี่ หรือ คลิกเพื่อเลือกไฟล์'}
              </p>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                รองรับรูปแบบไฟล์ที่หลากหลายเพื่อความสะดวกของคุณ
              </p>
            </div>
            <input id="file-upload" type="file" accept=".json,.xlsx,.xls,.csv,.pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleImport} isLoading={loading} disabled={!file} style={{
              width: '300px',
              height: '64px',
              borderRadius: '20px',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '700',
              boxShadow: '0 10px 20px rgba(21, 128, 61, 0.2)'
            }}>
              เริ่มนำเข้าข้อมูล
            </Button>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div style={{
            padding: 'var(--space-8)',
            backgroundColor: 'white',
            borderRadius: '32px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)'
          }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>สรุปจำนวนข้อมูล</h3>

            {[
              { label: 'กลุ่มเรียน', value: counts.groups, icon: <Users size={20} />, color: '#EEF2FF' },
              { label: 'รายวิชา', value: counts.courses, icon: <BookOpen size={20} />, color: '#F0FDF4' },
              { label: 'อาจารย์', value: counts.teachers, icon: <Users size={20} />, color: '#FFF7ED' },
              { label: 'ห้องเรียน', value: counts.rooms, icon: <School size={20} />, color: '#FDF2F8' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: 'var(--space-6)',
                  backgroundColor: item.color,
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-6)',
                  border: '1px solid rgba(0,0,0,0.03)'
                }}
              >
                <div style={{
                  fontSize: 'var(--font-size-xl)',
                  padding: '10px',
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>{item.label}</span>
                  <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 'var(--space-4)',
              padding: 'var(--space-6)',
              backgroundColor: '#F8FAFC',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              textAlign: 'center' as const
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <CheckCircle2 size={16} color={problem ? 'var(--accent)' : '#94A3B8'} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: '#64748B', fontWeight: '500' }}>
                  ความพร้อมของข้อมูล: {problem ? '100%' : '0%'}
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: '#E2E8F0',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: problem ? '100%' : '0%',
                  height: '100%',
                  backgroundColor: 'var(--accent)',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
