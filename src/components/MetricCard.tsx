import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: string;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'accent';
  icon?: LucideIcon;
  badge?: string;
  highlight?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  changeText,
  changeType = 'neutral',
  icon: Icon,
  badge,
  highlight = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl transition-all duration-300 ${
        highlight
          ? 'bg-gradient-to-b from-[#181E27] to-[#0F131A] border border-[#CCFF00]/30 shadow-lg shadow-[#CCFF00]/5'
          : 'bg-[#12151B]/90 hover:bg-[#161A22] border border-white/8 hover:border-white/15'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
        {badge && (
          <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/25">
            {badge}
          </span>
        )}
        {Icon && !badge && (
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-mono-numbers">
        {value}
      </div>

      {(subtext || changeText) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-zinc-400">
          {changeText && (
            <span
              className={`font-semibold inline-flex items-center gap-1 ${
                changeType === 'accent'
                  ? 'text-[#CCFF00]'
                  : changeType === 'positive'
                  ? 'text-emerald-400'
                  : changeType === 'negative'
                  ? 'text-rose-400'
                  : 'text-zinc-400'
              }`}
            >
              {changeText}
            </span>
          )}
          {subtext && <span className="text-zinc-500 truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
