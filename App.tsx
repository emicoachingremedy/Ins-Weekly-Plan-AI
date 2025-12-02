import React, { useState, useCallback, useEffect } from 'react';
import { THEMES, WEEKLY_SCHEDULE } from './constants';
import { GeneratedDay } from './types';
import { DayCard } from './components/DayCard';
import { Shuffle, Zap, Save } from 'lucide-react';

const App: React.FC = () => {
  const [schedule, setSchedule] = useState<GeneratedDay[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to get random item from array (for non-unique parts like format/engagement)
  const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Helper to draw a random item from a pool and return the item + remaining pool
  // This ensures mathematical uniqueness by physically reducing the available options.
  const drawCard = (pool: string[]) => {
    if (pool.length === 0) throw new Error("Pool is empty");
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    const remaining = [...pool.slice(0, randomIndex), ...pool.slice(randomIndex + 1)];
    return { selected, remaining };
  };

  // Function to generate the schedule
  const generateSchedule = useCallback(() => {
    setIsSpinning(true);
    
    // --- STEP 1: BRAND IDENTITY (Mon, Wed) ---
    // We need 2 unique pillars from a pool of 5.
    let biPool = [...THEMES['Brand Identity'].part1];
    
    const monDraw = drawCard(biPool);
    const monPillar = monDraw.selected;
    biPool = monDraw.remaining; // 4 left

    const wedDraw = drawCard(biPool);
    const wedPillar = wedDraw.selected;
    // biPool is unused after this (3 left)

    // --- STEP 2: CONNECTION (Tue, Thu) ---
    // We need 2 unique pillars from a pool of 4.
    // SHARED PILLAR CONSTRAINT:
    // 'Inspiration/Motivation' and 'Interactive' are shared with Entertainment.
    // If Connection picks BOTH of these, Entertainment (Fri/Sat/Sun) will only have 2 unique items left (Humor, Trends).
    // But Entertainment needs 3 items. This causes a crash/impossibility.
    // FIX: We must ensure Connection does NOT pick both shared pillars.
    
    let connPool = [...THEMES['Connection'].part1];
    let tuePillar = '';
    let thuPillar = '';
    let connPillars: string[] = [];

    let validConnFound = false;
    let attempts = 0;

    // Retry loop to ensure we find a valid pair (statistically 83% chance on first try)
    while (!validConnFound && attempts < 20) {
        // Create a temporary pool and draw 2
        let tempPool = [...connPool];
        const p1 = drawCard(tempPool);
        const p2 = drawCard(p1.remaining);
        
        const selected = [p1.selected, p2.selected];
        
        // Count how many shared pillars we picked
        const sharedCount = selected.filter(s => 
            s === 'Inspiration/Motivation' || s === 'Interactive'
        ).length;
        
        // If we picked less than 2 shared pillars, we leave enough for Entertainment
        if (sharedCount < 2) {
            tuePillar = p1.selected;
            thuPillar = p2.selected;
            connPillars = selected;
            validConnFound = true;
        }
        attempts++;
    }

    // Fallback safety (should never be hit given probabilities, but prevents crash)
    if (!validConnFound) {
        tuePillar = 'Storytelling';
        thuPillar = 'Behind-the-Scenes';
        connPillars = [tuePillar, thuPillar];
    }

    // --- STEP 3: ENTERTAINMENT (Fri, Sat, Sun) ---
    // We need 3 unique pillars from a pool of 4.
    let entPool = [...THEMES['Entertainment'].part1];
    
    // Filter out the pillars used by Connection to satisfy the cross-theme uniqueness rule
    entPool = entPool.filter(p => !connPillars.includes(p));

    // Because of our constraint check in Step 2, entPool.length is GUARANTEED to be >= 3.
    
    // Draw Friday
    const friDraw = drawCard(entPool);
    const friPillar = friDraw.selected;
    entPool = friDraw.remaining;

    // Draw Saturday
    const satDraw = drawCard(entPool);
    const satPillar = satDraw.selected;
    entPool = satDraw.remaining;

    // Draw Sunday
    const sunDraw = drawCard(entPool);
    const sunPillar = sunDraw.selected;

    // --- STEP 4: ASSEMBLE ---
    const newSchedule: GeneratedDay[] = WEEKLY_SCHEDULE.map((dayConfig) => {
      const themeData = THEMES[dayConfig.theme];
      let part1 = '';

      switch (dayConfig.day) {
        case 'Monday': part1 = monPillar; break;
        case 'Tuesday': part1 = tuePillar; break;
        case 'Wednesday': part1 = wedPillar; break;
        case 'Thursday': part1 = thuPillar; break;
        case 'Friday': part1 = friPillar; break;
        case 'Saturday': part1 = satPillar; break;
        case 'Sunday': part1 = sunPillar; break;
        default: part1 = getRandom(themeData.part1);
      }

      return {
        // Use a completely unique ID to force React to re-mount components
        // This ensures the SlotMachine animation resets correctly
        id: `${dayConfig.day}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        day: dayConfig.day,
        theme: dayConfig.theme,
        part1: part1,
        part2: getRandom(themeData.part2),
        format: getRandom(themeData.format),
      };
    });

    setSchedule(newSchedule);

    // Reset spinning state after animations complete
    setTimeout(() => {
      setIsSpinning(false);
    }, 3500);
  }, []);

  // Load from LocalStorage on mount
  useEffect(() => {
    // Bumped to v9 to ensure fresh logic is used
    const savedSchedule = localStorage.getItem('insWeeklyPlan_schedule_v9');
    
    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule);
        if (parsed && parsed.length > 0) {
          setSchedule(parsed);
        } else {
          generateSchedule();
        }
      } catch (e) {
        console.error("Failed to parse saved schedule", e);
        generateSchedule();
      }
    } else {
      generateSchedule();
    }
    setIsLoaded(true);
  }, [generateSchedule]);

  // Save to LocalStorage
  useEffect(() => {
    if (!isSpinning && schedule.length > 0) {
      localStorage.setItem('insWeeklyPlan_schedule_v9', JSON.stringify(schedule));
    }
  }, [schedule, isSpinning]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-800 pb-20 font-sans">
      {/* Navbar / Header */}
      <header className="border-b border-slate-200 bg-white/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-r from-[#d9cde5] to-[#d4edf0] rounded-xl flex items-center justify-center shadow-sm">
                <Zap className="text-[#44696e] w-6 h-6" fill="currentColor" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Ins Weekly Plan AI</h1>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={generateSchedule}
              disabled={isSpinning}
              className={`
                  px-6 py-3 rounded-full font-bold text-[#44696e] shadow-lg shadow-slate-200 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                  ${isSpinning 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80 shadow-none' 
                      : 'bg-gradient-to-r from-[#d9cde5] to-[#d4edf0] hover:brightness-105'
                  }
              `}
            >
              <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? 'Remixing...' : 'Remix Weekly Plan'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">Your Weekly Mix</h2>
              <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
                  We've combined your strategic pillars with engagement hooks using a 
                  <span className="text-[#44696e] font-semibold mx-1">Smart Strategy Engine</span>
                  to ensure maximum variety.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/50 px-3 py-1.5 rounded-full border border-slate-100">
                <Save className="w-3 h-3" />
                <span>Auto-saving enabled</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {schedule.map((day, index) => (
            <DayCard 
              key={day.id}
              data={day} 
              isSpinning={isSpinning}
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;