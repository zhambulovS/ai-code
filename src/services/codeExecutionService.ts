
// Этот сервис симулирует выполнение кода и проверку решений
// В реальном приложении здесь бы была интеграция с бэкендом для запуска кода

import { TestCase } from "./problemsService";

interface ExecutionResult {
  output: string;
  success: boolean;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}

interface TestResult {
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
          // Преобразуем входные данные в формат, понятный для JavaScript
          const parsedInput = parseInput(input);
          
          // Это очень упрощенная симуляция для демонстрационных целей
          // В реальном приложении код был бы выполнен в изолированной среде
          
          // Симуляция для задачи "Two Sum"
          if (input.includes("[") && input.includes("]")) {
            const lines = input.trim().split("\n");
            const nums = JSON.parse(lines[0]);
            const target = parseInt(lines[1]);
            
            // Упрощенная реализация алгоритма Two Sum для симуляции
            const map = new Map();
            for (let i = 0; i < nums.length; i++) {
              const complement = target - nums[i];
              if (map.has(complement)) {
                output = JSON.stringify([map.get(complement), i]);
                break;
              }
              map.set(nums[i], i);
            }
          } else {
            // Для других задач: симулируем случайный успех или ошибку
            success = Math.random() > 0.3;
            if (!success) {
              error = "Execution error: Code failed to produce expected output";
              output = "Error";
            } else {
              output = "Simulated output for: " + input;
            }
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
          executionTime: Math.floor(Math.random() * 100),
          memoryUsed: Math.floor(Math.random() * 10000),
          error
        });
      } catch (e) {
        resolve({
          output: "Error",
          success: false,
          executionTime: 0,
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

// Вспомогательная функция для парсинга входных данных
const parseInput = (input: string): any => {
  try {
    // Если входные данные в формате JSON, пытаемся их распарсить
    if (input.trim().startsWith("[") || input.trim().startsWith("{")) {
      return JSON.parse(input);
    }
    // Иначе возвращаем как есть
    return input;
  } catch {
    return input;
  }
};
