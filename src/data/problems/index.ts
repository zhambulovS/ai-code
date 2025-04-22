
import { ProblemData } from './types';
import { easyProblems } from './easyProblems';
import { mediumProblems } from './mediumProblems';
import { hardProblems } from './hardProblems';

// Combine all problems into a single array
export const allProblems: ProblemData[] = [
  ...easyProblems,
  ...mediumProblems,
  ...hardProblems
];

export type { ProblemData };
export { easyProblems, mediumProblems, hardProblems };
