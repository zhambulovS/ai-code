
export interface ExecutionResult {
  output: string;
  success: boolean;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}

export interface TestResult {
  testCase: any;
  output: string;
  expected: string;
  passed: boolean;
  executionTime: number;
  memoryUsed?: number;
  error?: string;
}

export interface CodeSubmission {
  code: string;
  language: string;
  input: string;
  timeLimit?: number;
  memoryLimit?: number;
}
