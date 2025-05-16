
import { Check, X, TimerIcon, HardDrive, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TestResult } from "@/services/codeExecutionService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TestResultsProps {
  results: TestResult[];
  isRunning?: boolean;
  onRerun?: () => void;
}

export function TestResults({ results, isRunning = false, onRerun }: TestResultsProps) {
  if (results.length === 0 && !isRunning) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Test Results</h3>
          {onRerun && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRerun}
              disabled={isRunning}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Run Again
            </Button>
          )}
        </div>
        
        {isRunning ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-3"></div>
            <p className="text-gray-600">Running tests...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={results.every(r => r.passed) ? "default" : "destructive"} className={results.every(r => r.passed) ? "bg-green-500" : ""}>
                {results.filter(r => r.passed).length}/{results.length} tests passed
              </Badge>
              {results.length > 0 && (
                <Badge variant="outline">
                  Average time: {(results.reduce((acc, r) => acc + r.executionTime, 0) / results.length).toFixed(2)} ms
                </Badge>
              )}
            </div>
            
            {results.map((result, index) => (
              <div key={index} className={`border rounded-md p-3 ${result.passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Test {index + 1}</span>
                  <div className="flex items-center">
                    {result.passed ? (
                      <Check className="h-5 w-5 text-green-500 mr-1" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mr-1" />
                    )}
                    <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="bg-white bg-opacity-50 p-2 rounded">
                    <span className="font-medium">Input:</span> <pre className="inline whitespace-pre-wrap">{result.testCase.input}</pre>
                  </div>
                  <div className="bg-white bg-opacity-50 p-2 rounded">
                    <span className="font-medium">Your output:</span> <pre className="inline whitespace-pre-wrap">{result.output}</pre>
                  </div>
                  <div className="bg-white bg-opacity-50 p-2 rounded">
                    <span className="font-medium">Expected output:</span> <pre className="inline whitespace-pre-wrap">{result.expected}</pre>
                  </div>
                  <div className="flex flex-wrap gap-x-4 mt-2">
                    <div className="flex items-center">
                      <TimerIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-600">Time: {result.executionTime} ms</span>
                    </div>
                    {result.memoryUsed !== undefined && (
                      <div className="flex items-center">
                        <HardDrive className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-gray-600">Memory: {(result.memoryUsed / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                  </div>
                  {result.error && (
                    <div className="bg-red-50 p-2 rounded mt-2 text-red-800">
                      <span className="font-medium">Error:</span> <pre className="whitespace-pre-wrap">{result.error}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
