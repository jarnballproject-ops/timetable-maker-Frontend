import { ApiClient, Problem, Schedule, Report, JobStatus, ApiError } from './types';
import { env } from '../../config/env';

export class HttpApiClient implements ApiClient {
  private handleRequestError(e: unknown): never {
    if (e instanceof Error && e.name === 'AbortError') {
      throw { code: 'TIMEOUT', message: 'Request timed out' };
    }
    if (typeof e === 'object' && e !== null && 'code' in e) {
      throw e;
    }
    throw {
      code: 'NETWORK',
      message: e instanceof Error ? e.message : 'Network error',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const url = env.apiUrl + endpoint;
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          code: (errorData.code || 'BAD_RESPONSE') as ApiError['code'],
          message: errorData.message || 'Server returned an error',
        };
      }
      return await response.json();
    } catch (e: unknown) {
      this.handleRequestError(e);
      throw new Error('Unhandled error'); // Satisfy TS
    }
  }

  async getHealth() {
    return this.request<{ status: string; version: string }>('/health');
  }

  async importData(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request<{ problem: Problem; warnings: unknown[] }>('/imports', {
      method: 'POST',
      body: formData,
    });
  }

  async solve(problem: Problem, options: unknown) {
    return this.request<{ jobId: string }>('/solve', {
      method: 'POST',
      body: JSON.stringify({ problem, ...(options as object) }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.request<JobStatus>('/jobs/' + jobId);
  }

  async cancelJob(jobId: string) {
    return this.request<{ success: boolean }>('/jobs/' + jobId + '/cancel', {
      method: 'POST',
    });
  }

  async validate(problem: Problem, schedule: Schedule): Promise<Report> {
    return this.request<Report>('/validate', {
      method: 'POST',
      body: JSON.stringify({ problem, schedule }),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
