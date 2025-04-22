
export interface ProblemData {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  acceptance_rate: number;
  time_limit: number; // in milliseconds
  memory_limit: number; // in bytes
  sample_testcases: {
    input: string;
    expected_output: string;
    is_sample: boolean;
  }[];
}
