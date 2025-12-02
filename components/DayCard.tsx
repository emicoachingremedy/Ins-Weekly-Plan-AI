import React from 'react';
import { GeneratedDay } from '../types';
import { THEMES } from '../constants';
import { SlotMachine } from './SlotMachine';

interface DayCardProps {
  data: GeneratedDay;
  isSpinning: boolean;
  index: number;
}

export const DayCard: React.FC<DayCardProps> = ({ data, isSpinning, index }) => {
  const themeConfig = THEMES[data.theme];
  
  // Stagger the stopping of slots for visual effect
  const baseDelay = index * 200; 

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 md:p-5 flex flex-col gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
        
      {/* Theme Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-slate-800">{data.day}</h3>
        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r ${themeConfig.gradientClass} ${themeConfig.textClass} shadow-sm`}>
          {data.theme}
        </span>
      </div>

      <div className="space-y-3">
        {/* Part 1: Messaging */}
        <SlotMachine 
          label="Part 1: Messaging Framework"
          value={data.part1} 
          options={themeConfig.part1} 
          isSpinning={isSpinning} 
          delay={baseDelay} 
        />

        {/* Part 2: Engagement */}
        <SlotMachine 
            label="Part 2: Ending Engagement"
            value={data.part2} 
            options={themeConfig.part2} 
            isSpinning={isSpinning} 
            delay={baseDelay + 400} 
        />

        {/* Format */}
        <SlotMachine 
            label="Post Format"
            value={data.format} 
            options={themeConfig.format} 
            isSpinning={isSpinning} 
            delay={baseDelay + 800} 
        />
      </div>

      {/* Decorative background blur */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${themeConfig.gradientClass} opacity-20 blur-3xl rounded-full pointer-events-none`} />
    </div>
  );
};