import React, { useState, useRef } from 'react';
import { InstallerEffectConfig, playPreviewClickSound } from '../effectsConfig';

interface EffectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  effects: InstallerEffectConfig;
  isPrimary?: boolean;
  accentColor?: string;
  surfaceColor?: string;
  textColor?: string;
  children: React.ReactNode;
  shakeTrigger?: boolean;
}

export const EffectButton: React.FC<EffectButtonProps> = ({
  effects,
  isPrimary = false,
  accentColor = '#3E4B37',
  surfaceColor = '#1A2218',
  textColor = '#F5F7F2',
  children,
  className = '',
  onClick,
  shakeTrigger = false,
  disabled,
  style,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // 5. Sound Click Feedback
    if (effects.soundClickFeedback) {
      playPreviewClickSound();
    }

    // 1. Ripple Effect
    if (effects.rippleEffect && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now() + Math.random(), x, y };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 500);
    }

    onClick?.(e);
  };

  // Base and dynamic styles depending on active effects
  const baseBg = isPrimary ? accentColor : `${accentColor}33`;
  const baseBorder = isPrimary ? accentColor : `${accentColor}80`;

  const classes = [
    'relative overflow-hidden font-semibold transition-all select-none',
    // 3. Pressed Depth Offset
    effects.pressedDepthOffset ? 'active:translate-y-[1.5px] active:scale-[0.98]' : '',
    // 7. Scale Bounce on Hover
    effects.scaleBounceOnHover ? 'hover:scale-[1.03] active:scale-[0.98]' : '',
    // 4. Neon Pulse / Breathing Border (applied to primary button)
    effects.neonPulseBorder && isPrimary ? 'animate-pulse' : '',
    // 8. Shake Error Animation
    shakeTrigger && effects.shakeErrorAnimation ? 'animate-shake' : '',
    // 10. Smooth Color Fade
    effects.smoothColorFade ? 'duration-200 ease-out' : 'duration-75',
    // 9. Glassmorphism Blur Highlight
    effects.glassmorphismBlur ? 'backdrop-blur-sm' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      style={{
        backgroundColor: baseBg,
        borderColor: baseBorder,
        color: textColor,
        ...style,
      }}
      {...props}
    >
      {/* 2. Hover Glow / Shimmer Light Beam */}
      {effects.hoverGlowShimmer && !disabled && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
      )}

      {/* 1. Ripple Wave Circles */}
      {effects.rippleEffect &&
        ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/30 animate-ripple"
            style={{
              left: r.x,
              top: r.y,
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
            }}
          />
        ))}

      <span className="relative z-10 flex items-center justify-center gap-1.5 w-full h-full">
        {children}
      </span>
    </button>
  );
};
