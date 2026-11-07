import { Problem, Schedule, Report, JobStatus } from '../lib/api-client/types';

export interface AppState {
  problem: Problem | null;
  currentSchedule: Schedule | null;
  currentReport: Report | null;
  activeJobId: string | null;
  lastOutcome: JobStatus['outcome'] | null;
}

const initialState: AppState = {
  problem: null,
  currentSchedule: null,
  currentReport: null,
  activeJobId: null,
  lastOutcome: null,
};

type Listener = (state: AppState) => void;

class Store {
  private state: AppState = { ...initialState };
  private listeners: Listener[] = [];

  getState(): AppState {
    return this.state;
  }

  setState(update: Partial<AppState>) {
    this.state = { ...this.state, ...update };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  reset() {
    this.setState(initialState);
  }
}

export const store = new Store();
