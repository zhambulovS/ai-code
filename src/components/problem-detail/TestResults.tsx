
import { Check, X, TimerIcon, HardDrive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TestResult } from "@/services/codeExecutionService";

interface TestResultsProps {
  results: TestResult[];
}

export function TestResults({ results }: TestResultsProps) {
  if (results.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Результаты тестирования</h3>
        <div className="space-y-3">
          {results.map((result, index) => (
            <div key={index} className={`border rounded-md p-3 ${result.passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Тест {index + 1}</span>
                <div className="flex items-center">
                  {result.passed ? (
                    <Check className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                    {result.passed ? 'Пройден' : 'Не пройден'}
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Вход:</span> {result.testCase.input.replace(/\n/g, ', ')}</div>
                <div><span className="font-medium">Ваш вывод:</span> {result.output}</div>
                <div><span className="font-medium">Ожидаемый вывод:</span> {result.expected}</div>
                <div className="flex flex-wrap gap-x-4 mt-2">
                  <div className="flex items-center">
                    <TimerIcon className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-600">Время: {result.executionTime} мс</span>
                  </div>
                  {result.memoryUsed !== undefined && (
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-600">Память: {(result.memoryUsed / 1024).toFixed(2)} МБ</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
