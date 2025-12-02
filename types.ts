export type ThemeType = 'Brand Identity' | 'Connection' | 'Entertainment';

export interface ThemeConfig {
  name: ThemeType;
  gradientClass: string;
  textClass: string;
  part1: string[];
  part2: string[];
  format: string[];
}

export interface DaySchedule {
  day: string;
  theme: ThemeType;
}

export interface GeneratedDay {
  id: string;
  day: string;
  theme: ThemeType;
  part1: string;
  part2: string;
  format: string;
}

export interface ContentGenerationResult {
  caption: string;
  visualDescription: string;
  hashtags: string[];
}