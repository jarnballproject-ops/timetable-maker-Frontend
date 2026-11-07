import React, { useState } from 'react';

interface TimetableCell {
  courseId: string;
  groupIds: string[];
  teacherId: string | null;
  roomId: string;
}

export const TimetableGrid: React.FC<{
  schedule: any;
  problem: any;
}> = ({ schedule, problem }) => {
  const [hoveredCell, setHoveredCell] = useState<TimetableCell | null>(null);

  // Generate Days and Periods
  const days = problem.time.days;
  const periods = problem.time.periods;

  // Map assignments to a grid: [day][period]
  const grid: Record<string, Record<number, TimetableCell>> = {};
  schedule.assignments.forEach((a: any) => {
    if (!grid[a.day]) grid[a.day] = {};
    grid[a.day][a.startPeriod] = {
      courseId: a.courseId,
      groupIds: a.groupIds,
      teacherId: a.teacherId,
      roomId: a.roomId,
    };
  });

  // Helper to get course details
  const getCourse = (id: string) => problem.courses.find((c: any) => c.id === id);
  const getTeacher = (id: string | null) => problem.teachers.find((t: any) => t.id === id);
  const getRoom = (id: string) => problem.rooms.find((r: any) => r.id === id);

  const getCourseColor = (id: string) => {
    const colors = [
      'var(--color-green-500)',
      'var(--color-green-600)',
      'var(--color-green-700)',
      'var(--color-green-800)',
      'var(--color-green-900)',
      'var(--color-mint-600)',
      'var(--color-mint-700)',
      'var(--color-mint-900)',
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `120px repeat(${days.length}, 1fr)`,
          gap: 'var(--space-2)',
          minWidth: '800px',
        }}
      >
        {/* Header Row */}
        <div style={{ backgroundColor: 'transparent' }} />
        {days.map((day) => (
          <div
            key={day}
            style={{
              textAlign: 'center' as const,
              fontWeight: 'bold',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
            }}
          >
            {day}
          </div>
        ))}

        {/* Period Rows */}
        {periods.map((period, pIdx) => (
          <React.Fragment key={period.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'bold',
                color: 'var(--color-text-muted)',
                borderRight: '2px solid var(--color-border-subtle)',
              }}
            >
              {period.time}
            </div>
            {days.map((day) => {
              const cell = grid[day]?.[period.id];
              const course = cell ? getCourse(cell.courseId) : null;

              return (
                <div
                  key={`${day}-${period.id}`}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{
                    minHeight: '60px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-subtle)',
                    backgroundColor: course
                      ? getCourseColor(course.id)
                      : 'var(--color-surface-canvas)',
                    color: course ? 'white' : 'transparent',
                    fontSize: 'var(--font-size-xs)',
                    padding: 'var(--space-2)',
                    cursor: course ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    transform: hoveredCell === cell ? 'scale(1.05)' : 'scale(1)',
                    zIndex: hoveredCell === cell ? 10 : 1,
                    boxShadow: hoveredCell === cell ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center' as const,
                  }}
                >
                  {course && (
                    <div style={{ fontWeight: 'bold', lineHeight: '1.2' }}>{course.code}</div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Floating Tooltip */}
      {hoveredCell && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'var(--color-surface-card)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            border: '1px solid var(--color-border-accent)',
            zIndex: 1000,
            width: '300px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h4 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
              {getCourse(hoveredCell.courseId)?.name}
            </h4>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              <div>👨‍🏫 {getTeacher(hoveredCell.teacherId)?.name || 'ไม่ระบุอาจารย์'}</div>
              <div>
                🏫 {getRoom(hoveredCell.roomId)?.id} ({getRoom(hoveredCell.roomId)?.type})
              </div>
              <div>👥 กลุ่ม: {hoveredCell.groupIds.join(', ')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
