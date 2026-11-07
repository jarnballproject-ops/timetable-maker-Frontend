import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  style,
  ...props
}) => {
  const variants = {
    primary: {
      bg: 'var(--color-action-primary-bg)',
      text: 'var(--color-action-primary-text)',
      border: 'transparent',
      hover: 'var(--color-green-800)',
    },
    secondary: {
      bg: 'var(--color-action-secondary-bg)',
      text: 'var(--color-action-secondary-text)',
      border: 'var(--color-border-default)',
      hover: 'var(--color-neutral-100)',
    },
    ghost: {
      bg: 'transparent',
      text: 'var(--color-text-secondary)',
      border: 'transparent',
      hover: 'var(--color-neutral-100)',
    },
    danger: {
      bg: 'var(--color-red-600)',
      text: 'var(--color-white)',
      border: 'transparent',
      hover: 'var(--color-red-800)',
    },
  };

  const active = variants[variant];

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = active.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = active.bg;
      }}
      style={{
        padding: 'var(--space-2) var(--space-4)',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${active.border}`,
        backgroundColor: active.bg,
        color: active.text,
        fontSize: 'var(--font-size-md)',
        fontWeight: '500',
        cursor: props.disabled || isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        userSelect: 'none',
        ...style,
      }}
    >
      {isLoading && <span style={{ animation: 'spin 1s linear infinite' }}>🌀</span>}
      <span>{children}</span>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
};
