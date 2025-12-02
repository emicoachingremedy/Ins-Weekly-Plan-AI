import { ThemeConfig, DaySchedule, ThemeType } from './types';

export const THEMES: Record<ThemeType, ThemeConfig> = {
  'Brand Identity': {
    name: 'Brand Identity',
    gradientClass: 'from-[#e2e9f1] to-[#f8aeab]',
    textClass: 'text-[#3f5e8e]',
    part1: [
      'Authority',
      'Brand Building',
      'Problem Solving',
      'Social Proof',
      'Educational'
    ],
    part2: [
      'Soft Promo (Offer Trigger)',
      'Question Prompt',
      'Call to Share'
    ],
    format: ['Reel', 'Single Image', 'Carousel']
  },
  'Connection': {
    name: 'Connection',
    gradientClass: 'from-[#f9eef1] to-[#bab7db]',
    textClass: 'text-[#ae686f]',
    part1: [
      'Storytelling',
      'Behind-the-Scenes',
      'Inspiration/Motivation',
      'Interactive'
    ],
    part2: [
      'Comment an Emoji',
      'Tag a Friend',
      'Challenge or Task'
    ],
    format: ['Reel', 'Single Image', 'Carousel']
  },
  'Entertainment': {
    name: 'Entertainment',
    gradientClass: 'from-[#dfe8e7] to-[#f89e53]',
    textClass: 'text-[#44696e]',
    part1: [
      'Humor and Relatability',
      'Interactive',
      'Trends',
      'Inspiration/Motivation'
    ],
    part2: [
      'Comment an Emoji',
      'Tag a Friend',
      'Challenge or Task'
    ],
    format: ['Reel', 'Single Image', 'Carousel']
  }
};

export const WEEKLY_SCHEDULE: DaySchedule[] = [
  { day: 'Monday', theme: 'Brand Identity' },
  { day: 'Tuesday', theme: 'Connection' },
  { day: 'Wednesday', theme: 'Brand Identity' },
  { day: 'Thursday', theme: 'Connection' },
  { day: 'Friday', theme: 'Entertainment' },
  { day: 'Saturday', theme: 'Entertainment' },
  { day: 'Sunday', theme: 'Entertainment' }
];

export const PLACEHOLDER_IMAGES = {
  'Reel': 'https://picsum.photos/300/533', // 9:16 approx
  'Single Image': 'https://picsum.photos/300/300',
  'Carousel': 'https://picsum.photos/300/300',
};