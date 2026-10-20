export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type SlotType = 'LEC' | 'TUT' | 'CASE' | 'LAB';

export type SubjectCategory = 'Core Commerce' | 'Corporate Law' | 'Allied Labs' | 'Management' | 'Humanities';

export interface Subject {
  id: string;
  code: string;
  name: string;
  shortName: string;
  department: string;
  hoursPerWeek: number;
  category: SubjectCategory;
  primaryColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  title: string;
  department: string;
  email: string;
  maxDailyPeriods: number;
  assignedHours: number;
  preferredMorning: boolean;
  avatarUrl?: string;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  type: 'Lecture Hall' | 'Classroom' | 'Computer Lab';
  capacity: number;
  building: string;
  floor: string;
  hasProjector: boolean;
}

export interface PeriodSlot {
  periodNumber: number; // 1 to 5
  label: string; // e.g. "P-1"
  startTime: string; // 24-hour time, e.g. "08:00"
  endTime: string; // 24-hour time, e.g. "09:00"
  displayTime: string; // Human-readable period time
  isRecessAfter?: boolean;
}

export interface ScheduledClass {
  id: string;
  day: DayOfWeek;
  periodNumber: number;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  type: SlotType;
  facultyId: string;
  facultyName: string;
  facultyCode: string;
  roomId: string;
  roomCode: string;
  cohort: 'Div A' | 'Div B' | 'Div C';
  topicOrUnit?: string;
}

export interface ConstraintViolation {
  id: string;
  type: 'HARD' | 'SOFT';
  name: string;
  description: string;
  count: number;
  resolutionEpoch?: string;
  penaltyPoints: number;
  impactText: string;
}

export interface TimetableVersion {
  id: string;
  version: string;
  name: string;
  type: 'Active GA' | 'Manual Draft' | 'GA Run Archive';
  timestamp: string;
  fitness: number;
  hardViolations: number;
  softPenalties: number;
  generation: number;
  isLive: boolean;
  notes?: string;
  schedule?: ScheduledClass[];
  cohort?: 'Div A' | 'Div B' | 'Div C';
}

export interface GAHyperparameters {
  selectionOperator: 'Tournament' | 'Roulette Wheel' | 'Rank Selection';
  tournamentK: number;
  selectivePressure: number;
  populationSize: number;
  crossoverRate: number; // e.g. 0.85
  crossoverType: '2-Point Ordered OX' | 'Uniform' | 'Single Point';
  mutationRate: number; // e.g. 0.08
  mutationType: 'Swap & Shift Matrix' | 'Bit Inversion' | 'Scramble';
  maxGenerations: number;
  elitismKeepers: number;
}

export interface GATelemetry {
  generation: number;
  maxGenerations: number;
  elapsedSeconds: number;
  rateGensPerSec: number;
  bestFitness: number;
  meanFitness: number;
  minFitness: number;
  hardViolations: number;
  softPenalties: number;
  diversityIndex: number;
  convergenceProgress: number; // 0 to 100
  history: Array<{
    gen: number;
    best: number;
    mean: number;
    min: number;
  }>;
}
