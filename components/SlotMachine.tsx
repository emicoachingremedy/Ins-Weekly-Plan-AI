import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlotMachineProps {
  options: string[];
  value: string;
  isSpinning: boolean;
  delay?: number; // Delay before stopping for cascading effect
  label: string;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ options, value, isSpinning, delay = 0, label }) => {
  // Initialize with the value if present, otherwise default to first option
  const [displayValue, setDisplayValue] = useState(value);
  const [internalSpinning, setInternalSpinning] = useState(false);
  
  // Handle the logic to start spinning and stop after a delay
  useEffect(() => {
    if (isSpinning) {
      setInternalSpinning(true);
      const interval = setInterval(() => {
        const randomOption = options[Math.floor(Math.random() * options.length)];
        setDisplayValue(randomOption);
      }, 80); // Speed of text change

      // Stop spinning after a delay + base duration
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setInternalSpinning(false);
        // Ensure we set the final value explicitly when spinning stops
        setDisplayValue(value);
      }, 1000 + delay);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
        // If not spinning, ensure we display the current prop value
        // This handles re-renders where 'value' prop might update without a spin event
        if (!internalSpinning) {
             setDisplayValue(value);
        }
    }
  }, [isSpinning, value, options, delay, internalSpinning]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 h-[56px] flex items-center overflow-hidden relative group hover:border-slate-300 transition-colors shadow-sm inner-shadow">
        <AnimatePresence mode="wait">
          <motion.span
            key={displayValue + (internalSpinning ? 'spin' : 'static')}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`text-sm md:text-base font-medium truncate w-full ${
              internalSpinning ? 'text-slate-400 blur-[0.5px]' : 'text-slate-700'
            }`}
          >
            {displayValue || <span className="text-transparent">Loading</span>}
          </motion.span>
        </AnimatePresence>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      </div>
    </div>
  );
};