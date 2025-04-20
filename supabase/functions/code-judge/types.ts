
export type ExecutionResult = {
  status: string;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
  testResults?: TestResult[];
};

export type TestResult = {
  id: string;
  input: string;
  expected: string;
  output: string;
  passed: boolean;
  executionTime: number;
  memoryUsed: number;
  error?: string;
};

export interface CodeSubmission {
  code: string;
  language: string;
  problemId?: number;
  userId?: string;
  input?: string;
  timeLimit: number;
  memoryLimit: number;
}
