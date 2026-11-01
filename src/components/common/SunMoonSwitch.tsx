import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './sunmoon.css';

export interface SunMoonSwitchProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
}

export const SunMoonSwitch: React.FC<SunMoonSwitchProps> = ({ 
  className = '', 
  size = 'md',
  showLabel = false 
}) => {
  const { isDark, toggleTheme } = useTheme();

  // Size corresponds to font-size since all dimensions (track, walker, legs) use em
  const sizeStyles: Record<string, string> = {
    sm: 'text-[14px]',
    md: 'text-[17px]',
    lg: 'text-[24px]',
    hero: 'text-[clamp(2.2rem,1.2rem+4vw,4rem)]'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <label 
        className={`sunmoon-switch switch ${sizeStyles[size] || sizeStyles.md}`} 
        title={isDark ? "Chuyển sang giao diện Sáng (Ban ngày)" : "Chuyển sang giao diện Tối (Ban đêm)"}
      >
        <span className={`track ${isDark ? 'is-checked' : ''}`}>
          <span className="stars" aria-hidden="true" />
          <span className="walker" aria-hidden="true">
            <span className="leg" />
            <span className="leg leg--b" />
            <span className="body">
              <span className="form form--sun">
                <span className="rays" />
                <span className="sun-disc" />
                <span className="face">
                  <span className="eye eye--l" />
                  <span className="eye eye--r" />
                  <span className="cheek cheek--l" />
                  <span className="cheek cheek--r" />
                  <span className="mouth" />
                </span>
              </span>
              <span className="form form--moon">
                <span className="moon-disc" />
                <span className="face">
                  <span className="snooze" />
                  <span className="cheek" />
                  <span className="mouth" />
                </span>
              </span>
            </span>
          </span>
          <input 
            className="switch__input" 
            id="sunmoon" 
            type="checkbox" 
            role="switch" 
            checked={isDark}
            onChange={toggleTheme}
            aria-label={isDark ? "Đang bật chế độ tối. Nhấn để chuyển sang chế độ sáng" : "Đang bật chế độ sáng. Nhấn để chuyển sang chế độ tối"} 
          />
        </span>
      </label>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 select-none">
          {isDark ? 'Giao diện Tối' : 'Giao diện Sáng'}
        </span>
      )}
    </div>
  );
};

