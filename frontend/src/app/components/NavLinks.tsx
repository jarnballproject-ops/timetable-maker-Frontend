import React from 'react';
import { NavLink } from 'react-router-dom';

const stepStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
  textDecoration: 'none',
  padding: 'var(--space-3) var(--space-6)',
  borderRadius: 'var(--radius-md)',
  transition: 'all 0.3s ease',
  fontSize: 'var(--font-size-sm)',
  fontWeight: '500',
};

const activeStepStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-soft)',
  color: 'var(--accent)',
  boxShadow: '0 4px 12px rgba(21, 128, 61, 0.1)',
};

const inactiveStepStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: 'var(--text-muted)',
};

export const NavLinks: React.FC = () => {
  const steps = [
    { path: '/import', label: 'นำเข้าข้อมูล', step: 1 },
    { path: '/solve', label: 'ประมวลผล', step: 2 },
    { path: '/result', label: 'ผลลัพธ์', step: 3 },
  ];

  return (
    <nav
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-4)' }}
    >
      {steps.map((s, i) => (
        <React.Fragment key={s.path}>
          <NavLink
            to={s.path}
            style={stepStyle}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {({ isActive }) => (
              <div style={isActive ? activeStepStyle : inactiveStepStyle}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--accent)' : 'var(--color-border-subtle)',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'bold',
                    marginRight: 'var(--space-3)',
                  }}
                >
                  {s.step}
                </span>
                {s.label}
              </div>
            )}
          </NavLink>
          {i < steps.length - 1 && (
            <div style={{ color: 'var(--color-border-subtle)', fontSize: 'var(--font-size-sm)' }}>
              →
            </div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
