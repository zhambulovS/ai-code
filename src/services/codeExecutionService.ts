// Этот сервис симулирует выполнение кода и проверку решений
// В реальном приложении здесь бы была интеграция с бэкендом для запуска кода

import { TestCase } from "./problemsService";

export interface ExecutionResult {
  output: string;
  success: boolean;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}

export interface TestResult {
  testCase: TestCase;
  output: string;
  expected: string;
  passed: boolean;
  executionTime: number;
}

export const executeCode = async (
  code: string,
  language: string,
  input: string
): Promise<ExecutionResult> => {
  // Симуляция выполнения кода
  return new Promise((resolve) => {
    // Эмуляция времени выполнения
    const executionDelay = Math.random() * 1000 + 500;
    
    setTimeout(() => {
      try {
        let output = "";
        let success = true;
        let error = undefined;
        
        // Простая эмуляция для JavaScript
        if (language === "javascript") {
          try {
            // Парсим входные данные для задачи
            const { nums, target } = parseInputForTwoSum(input);
            
            // Создаем функцию из кода пользователя
            // eslint-disable-next-line no-new-func
            const userFunction = new Function('nums', 'target', `
              ${code}
              return twoSum(nums, target);
            `);
            
            // Вызываем функцию пользователя с правильными аргументами
            const result = userFunction(nums, target);
            
            // Преобразуем результат в строку для сравнения
            output = JSON.stringify(result);
            success = true;
          } catch (e) {
            success = false;
            error = e instanceof Error ? e.message : "Ошибка выполнения кода";
            output = "Error";
            console.error("Code execution error:", e);
          }
        } else {
          // Для других языков просто возвращаем симулированный результат
          success = Math.random() > 0.3;
          if (!success) {
            error = `Execution error in ${language}: Code failed to compile or execute`;
            output = "Error";
          } else {
            output = "Simulated output for: " + input;
          }
        }
        
        resolve({
          output,
          success,
          executionTime: Math.floor(Math.random() * 100) + 1, // Гарантируем ненулевое время
          memoryUsed: Math.floor(Math.random() * 10000),
          error
        });
      } catch (e) {
        resolve({
          output: "Error",
          success: false,
          executionTime: 1, // Даже при ошибке показываем минимальное время
          memoryUsed: 0,
          error: e instanceof Error ? e.message : "Unknown error occurred"
        });
      }
    }, executionDelay);
  });
};

export const runTestCases = async (
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<TestResult[]> => {
  const results: TestResult[] = [];
  
  for (const testCase of testCases) {
    const result = await executeCode(code, language, testCase.input);
    
    // Очистка вывода для сравнения
    const normalizedOutput = normalizeOutput(result.output);
    const normalizedExpected = normalizeOutput(testCase.expected_output);
    
    results.push({
      testCase,
      output: result.output,
      expected: testCase.expected_output,
      passed: normalizedOutput === normalizedExpected,
      executionTime: result.executionTime
    });
  }
  
  return results;
};

// Вспомогательная функция для нормализации вывода
const normalizeOutput = (output: string): string => {
  return output.trim().replace(/\s+/g, " ");
};

// Вспомогательная функция для парсинга входных данных для задачи Two Sum
const parseInputForTwoSum = (input: string): { nums: number[], target: number } => {
  try {
    // Разбиваем входные данные по строкам
    const lines = input.trim().split("\n");
    
    // Парсим массив чисел из первой строки
    let numsString = lines[0].trim();
    // Удаляем квадратные скобки, если они есть
    numsString = numsString.replace(/^\[|\]$/g, "");
    // Парсим числа
    const nums = numsString.split(",").map(n => parseInt(n.trim(), 10));
    
    // Парсим целевое число из второй строки
    const target = parseInt(lines[1].trim(), 10);
    
    return { nums, target };
  } catch (error) {
    console.error("Error parsing input for Two Sum:", error);
    return { nums: [], target: 0 };
  }
};
