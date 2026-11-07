export type ApiMode = 'stub' | 'http';

export interface Problem {
  time: {
    days: string[];
    periods: { id: number; time: string }[];
    lunchPeriods: number[];
    maxPeriodByLevel: number;
  };
  levels: {
    groups: { id: string; level: string; name: string }[];
  };
  courses: {
    id: string;
    code: string;
    name: string;
    hours: number;
    kind: 'theory' | 'practice';
    category: string;
    levelId: string;
    roomRequirement: string;
    fixedSlot?: { day: string; startPeriod: number; endPeriod: number };
    sharedGroups?: string[];
  }[];
  teachers: {
    id: string;
    name: string;
    position: string;
    minHours: number;
    maxHours: number;
    unavailable: { day: string; periods: number[] }[];
    eligibleCourses?: string[];
  }[];
  rooms: {
    id: string;
    type: string;
    capacity: number;
    unavailable: { day: string; periods: number[] }[];
    shareable: boolean;
  }[];
  assumptions: {
    rules: Record<string, unknown>;
  };
}

export interface Schedule {
  assignments: {
    courseId: string;
    groupIds: string[];
    teacherId: string | null;
    roomId: string;
    day: string;
    startPeriod: number;
    length: number;
  }[];
  lunch: {
    groupId: string;
    day: string;
    period: number;
  }[];
}

export interface Report {
  violations: {
    rubricId: string;
    rule: string;
    severity: 'hard' | 'soft';
    message: string;
    refs: Record<string, unknown>;
  }[];
  summary: {
    rubricId: string;
    passed: boolean;
    count: number;
  }[];
  teacherLoad: {
    teacherId: string;
    hours: number;
    min: number;
    max: number;
    ok: boolean;
  }[];
  infeasibility: {
    code: string;
    message: string;
    refs: Record<string, unknown>;
  }[];
  metrics: {
    penalty: number;
    weight: number;
  };
}

export interface JobStatus {
  jobId: string;
  status: 'queued' | 'running' | 'done' | 'failed' | 'cancelled';
  progress?: {
    phase: string;
    percent: number;
    elapsedMs: number;
  };
  outcome?: 'solved' | 'partial' | 'infeasible';
  report?: Report;
  schedule?: Schedule;
  error?: {
    code: string;
    message: string;
  };
  penaltyHistory?: {
    iter: number;
    penalty: number;
    hardViolations: number;
  }[];
}

export interface ApiError {
  code:
    | 'INVALID_INPUT'
    | 'ALGO_ERROR'
    | 'NOT_READY'
    | 'JOB_NOT_FOUND'
    | 'TIMEOUT'
    | 'NETWORK'
    | 'BAD_RESPONSE';
  message: string;
}

export interface ApiClient {
  getHealth(): Promise<{ status: string; version: string }>;
  importData(file: File): Promise<{ problem: Problem; warnings: unknown[] }>;
  solve(problem: Problem, options: unknown): Promise<{ jobId: string }>;
  getJobStatus(jobId: string): Promise<JobStatus>;
  cancelJob(jobId: string): Promise<{ success: boolean }>;
  validate(problem: Problem, schedule: Schedule): Promise<Report>;
}
