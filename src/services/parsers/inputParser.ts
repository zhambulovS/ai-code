
/**
 * Parse input for Two Sum problem
 */
export const parseInputForTwoSum = (input: string): { nums: number[], target: number } => {
  // Default values
  let nums: number[] = [];
  let target: number = 0;
  
  try {
    // Handle multi-line input
    const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
    
    if (lines.length >= 2) {
      // Parse array from the first line
      const arrayMatch = lines[0].match(/\[(.*?)\]/);
      if (arrayMatch) {
        const arrayString = arrayMatch[1].trim();
        nums = arrayString ? arrayString.split(',').map(s => Number(s.trim())) : [];
      }
      
      // Parse target from the second line
      const targetMatch = lines[1].match(/(-?\d+)/);
      if (targetMatch) {
        target = Number(targetMatch[1]);
      }
    } else {
      // Handle single-line input with both array and target
      const arrayMatch = input.match(/\[(.*?)\]/);
      if (arrayMatch) {
        const arrayString = arrayMatch[1].trim();
        nums = arrayString ? arrayString.split(',').map(s => Number(s.trim())) : [];
      }
      
      // Find target after the array
      const afterArray = input.substring(input.indexOf(']') + 1);
      const targetMatch = afterArray.match(/(-?\d+)/);
      if (targetMatch) {
        target = Number(targetMatch[1]);
      }
    }
    
  } catch (error) {
    console.error('Error parsing input:', error);
    // Return default values on error
  }
  
  return { nums, target };
};

/**
 * Parse general input based on common formats
 */
export const parseInput = (input: string): any => {
  try {
    // Try to identify if input is JSON
    const trimmedInput = input.trim();
    if ((trimmedInput.startsWith('[') && trimmedInput.endsWith(']')) || 
        (trimmedInput.startsWith('{') && trimmedInput.endsWith('}'))) {
      return JSON.parse(trimmedInput);
    }
    
    // Check if it's a multi-line input
    const lines = trimmedInput.split('\n').filter(Boolean);
    if (lines.length > 1) {
      return lines;
    }
    
    // Return as is for simple inputs
    return input;
  } catch (error) {
    console.error('Error in parseInput:', error);
    return input;
  }
};

/**
 * Parse input for valid parentheses problem
 */
export const parseInputForValidParentheses = (input: string): string => {
  try {
    // Remove any quotes if present
    let cleaned = input.trim();
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
        (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
      cleaned = cleaned.substring(1, cleaned.length - 1);
    }
    
    return cleaned;
  } catch (error) {
    console.error('Error parsing parentheses input:', error);
    return input;
  }
};

/**
 * Parse input with multiple test cases
 */
export const parseMultipleTestCases = (input: string): string[] => {
  try {
    const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
    
    // If the first line could be a number indicating test cases count
    if (lines.length > 1 && /^\d+$/.test(lines[0])) {
      return lines.slice(1);
    }
    
    return lines;
  } catch (error) {
    console.error('Error parsing multiple test cases:', error);
    return [input];
  }
};
