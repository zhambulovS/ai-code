
export const parseInputForTwoSum = (input: string): { nums: number[], target: number } => {
  try {
    if (!input || typeof input !== 'string') {
      return { nums: [], target: 0 };
    }

    const lines = input.trim().split("\n");
    
    if (lines.length < 2) {
      return { nums: [], target: 0 };
    }
    
    let numsString = lines[0].trim();
    numsString = numsString.replace(/^\[|\]$/g, "");
    const nums = numsString.split(",").map(n => parseInt(n.trim(), 10));
    
    const target = parseInt(lines[1].trim(), 10);
    
    return { nums, target };
  } catch (error) {
    console.error("Error parsing input for Two Sum:", error);
    return { nums: [], target: 0 };
  }
};

export const parseInput = (input: string, problemType: string): any => {
  switch (problemType) {
    case "twoSum":
      return parseInputForTwoSum(input);
    default:
      return { rawInput: input };
  }
};
