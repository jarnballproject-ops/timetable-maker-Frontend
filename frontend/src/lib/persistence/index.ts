import { Problem, Schedule, Report, JobStatus } from '../api-client/types';

const STORAGE_KEYS = {
  PROBLEM: 'ttm_problem',
  SCHEDULE: 'ttm_schedule',
  REPORT: 'ttm_report',
  JOB_ID: 'ttm_job_id',
  OUTCOME: 'ttm_outcome',
} as const;

export const persistence = {
  saveProblem: (problem: Problem) => {
    localStorage.setItem(STORAGE_KEYS.PROBLEM, JSON.stringify(problem));
  },
  loadProblem: (): Problem | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PROBLEM);
    return data ? JSON.parse(data) : null;
  },
  saveSchedule: (schedule: Schedule) => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  },
  loadSchedule: (): Schedule | null => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return data ? JSON.parse(data) : null;
  },
  saveReport: (report: Report) => {
    localStorage.setItem(STORAGE_KEYS.REPORT, JSON.stringify(report));
  },
  loadReport: (): Report | null => {
    const data = localStorage.getItem(STORAGE_KEYS.REPORT);
    return data ? JSON.parse(data) : null;
  },
  saveJobId: (id: string) => {
    localStorage.setItem(STORAGE_KEYS.JOB_ID, id);
  },
  loadJobId: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.JOB_ID);
  },
  saveOutcome: (outcome: JobStatus['outcome']) => {
    localStorage.setItem(STORAGE_KEYS.OUTCOME, outcome || '');
  },
  loadOutcome: (): JobStatus['outcome'] | null => {
    const data = localStorage.getItem(STORAGE_KEYS.OUTCOME);
    return data ? (data as JobStatus['outcome']) : null;
  },
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};
