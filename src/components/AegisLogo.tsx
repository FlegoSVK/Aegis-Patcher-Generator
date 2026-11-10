import React from 'react';

interface AegisLogoProps {
  className?: string;
  size?: number;
}

export const AegisLogo: React.FC<AegisLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      {/* Ambient Outer Aura Glow */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-60 bg-gradient-to-tr from-[#3E4B37] via-[#6B855D] to-[#8FA87F] animate-pulse pointer-events-none"
        style={{ transform: 'scale(1.15)' }}
      />
      
      {/* Tactical SVG Shield Monogram */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Main Shield Metallic Gradient */}
          <linearGradient id="aegisMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E6544" />
            <stop offset="50%" stopColor="#2E3C29" />
            <stop offset="100%" stopColor="#1A2417" />
          </linearGradient>

          {/* Core Accent Gradient */}
          <linearGradient id="aegisCore" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2F0D9" />
            <stop offset="40%" stopColor="#9EBA8D" />
            <stop offset="100%" stopColor="#4E6544" />
          </linearGradient>

          {/* Outer Border Stroke */}
          <linearGradient id="aegisStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B4CF9F" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#556E4B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#273621" stopOpacity="0.9" />
          </linearGradient>

          {/* High-tech glow filter */}
          <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield Frame (Tactical Beveled Polygon) */}
        <path
          d="M20 2.5L34 7.8V19.2C34 27.5 28.1 34.8 20 37.5C11.9 34.8 6 27.5 6 19.2V7.8L20 2.5Z"
          fill="url(#aegisMetallic)"
          stroke="url(#aegisStroke)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Inner Tactical Inset Groove */}
        <path
          d="M20 6.2L30.5 10.3V18.8C30.5 25.1 26 30.8 20 33.2C14 30.8 9.5 25.1 9.5 18.8V10.3L20 6.2Z"
          fill="#10170E"
          fillOpacity="0.75"
          stroke="#384931"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Geometric 'A' (Aegis Core) */}
        {/* A Apex Peak & Legs */}
        <path
          d="M20 10.5L26 25.5H22.4L20.8 21.2H19.2L17.6 25.5H14L20 10.5Z"
          fill="url(#aegisCore)"
          filter="url(#shieldGlow)"
        />

        {/* Inner A Cutout */}
        <polygon
          points="20,14.5 18.3,18.8 21.7,18.8"
          fill="#0D130C"
        />

        {/* Tactical Crosshair / Precision Center Notch */}
        <circle cx="20" cy="20" r="1.2" fill="#EBF5E5" />
      </svg>
    </div>
  );
};
