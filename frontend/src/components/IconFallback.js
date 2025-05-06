  import React from 'react';
  
  export const IconFallback = ({ name, size = 24, color = 'currentColor', style = {}, className = '' }) => {
    // 基本的なスタイル
    const baseStyle = {
      width: `${size}px`,
      height: `${size}px`,
      display: 'inline-block',
      color: color,
      ...style
    };
    
    // 各アイコンのSVGパスを定義
    const icons = {
      'rotate-ccw': (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={baseStyle} className={className}>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
      ),
      'rotate-cw': (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={baseStyle} className={className}>
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
        </svg>
      ),
      'vibrate': (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={baseStyle} className={className}>
          <path d="m2 8 2 2-2 2 2 2-2 2"></path>
          <path d="m22 8-2 2 2 2-2 2 2 2"></path>
          <rect x="8" y="5" width="8" height="14" rx="1"></rect>
        </svg>
      ),
      'refresh-cw': (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={baseStyle} className={className}>
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M3 21v-5h5"></path>
        </svg>
      )
    };
    
    return icons[name] || <div style={baseStyle}></div>;
  };
  
