
// Helper function to extract an array from various formats
const extractArray = (input: string): number[] => {
  // Try to match array syntax [1, 2, 3]
  const arrayMatch = input.match(/\[(.*?)\]/);
  if (arrayMatch && arrayMatch[1]) {
    return arrayMatch[1].split(',').map(s => Number(s.trim()));
  }
  
  // Try to get first line as space/comma separated numbers
  const firstLine = input.split('\n')[0].trim();
  const numbers = firstLine.split(/[,\s]+/).map(Number);
  
  if (numbers.every(n => !isNaN(n))) {
    return numbers;
  }
  
  throw new Error("Could not parse input as an array");
};

// Helper to extract a single number (often used as target)
const extractTarget = (input: string): number => {
  // Try to get the second line or after the array
  const lines = input.split('\n').filter(line => line.trim());
  
  if (lines.length > 1) {
    return Number(lines[1].trim());
  }
  
  // If there's only one line, try to find a number after the array
  const afterArray = input.match(/\].*?(\d+)/);
  if (afterArray && afterArray[1]) {
    return Number(afterArray[1]);
  }
  
  throw new Error("Could not parse target value");
};

export const parseInputForTwoSum = (input: string): { nums: number[], target: number } => {
  try {
    const nums = extractArray(input);
    const target = extractTarget(input);
    
    return { nums, target };
  } catch (error) {
    console.error("Error parsing twoSum input:", error);
    throw new Error(`Invalid input format for twoSum: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const parseInput = (input: string, problemType: string = 'generic'): any => {
  if (problemType === 'twoSum') {
    return parseInputForTwoSum(input);
  }
  
  // Add more problem-specific parsers as needed
  
  // For generic input, try to determine the type and return appropriate structure
  if (input.includes('[') && input.includes(']')) {
    try {
      return { array: extractArray(input) };
    } catch (e) {
      // Not an array format
    }
  }
  
  // Default handling - just return the input as is
  return { input };
};
