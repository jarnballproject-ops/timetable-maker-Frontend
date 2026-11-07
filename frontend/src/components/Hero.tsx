import React from 'react';

export const Hero: React.FC<{
  title: string;
  subtitle: string;
  ctaText?: string;
  onCtaClick?: () => void;
}> = ({ title, subtitle, ctaText, onCtaClick }) => {
  return (
    <div
      style={{
        position: 'relative',
        padding: 'var(--space-12) var(--space-8)',
        borderRadius: 'var(--radius-xl)',
        background:
          'linear-gradient(135deg, var(--color-green-800) 0%, var(--color-green-600) 100%)',
        color: 'white',
        overflow: 'hidden',
        marginBottom: 'var(--space-12)',
        boxShadow: '0 20px 40px rgba(11, 43, 38, 0.2)',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
        <h1
          style={{
            fontSize: '40px',
            fontWeight: '800',
            margin: 0,
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-lg)',
            opacity: 0.9,
            marginTop: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
            lineHeight: '1.6',
          }}
        >
          {subtitle}
        </p>
        {ctaText && (
          <button
            onClick={onCtaClick}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: 'white',
              color: 'var(--color-green-900)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 'var(--font-size-md)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {ctaText}
          </button>
        )}
      </div>

      {/* Decorative Floating Timetable Element */}
      <div
        style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-20px',
          width: '300px',
          height: '200px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-lg)',
          transform: 'rotate(-10deg)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: 'var(--space-4)',
          backdropFilter: 'blur(10px)',
          pointerEvents: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
        }}
      >
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.2)' : 'transparent',
              borderRadius: '4px',
              height: '30px',
            }}
          />
        ))}
      </div>
    </div>
  );
};
