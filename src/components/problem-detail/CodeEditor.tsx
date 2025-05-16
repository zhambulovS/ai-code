
import { Play, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TestResult } from "@/services/codeExecutionService";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CodeEditorProps {
  code: string;
  language: string;
  isRunning: boolean;
  isSubmitting: boolean;
  testResults: TestResult[];
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
}

export function CodeEditor({
  code,
  language,
  isRunning,
  isSubmitting,
  testResults,
  onCodeChange,
  onLanguageChange,
  onReset,
  onRun,
  onSubmit
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState<string>("16px");
  
  const handleDownload = () => {
    const extension = language === "python" ? ".py" : language === "javascript" ? ".js" : ".txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Font Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="18px">18px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleDownload} title="Download solution">
          <Download className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-gray-900 rounded-lg border border-gray-700">
        <Textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="font-mono text-gray-100 bg-transparent p-4 min-h-[400px] w-full border-none focus-visible:ring-0 resize-vertical"
          style={{ fontSize: fontSize }}
          spellCheck={false}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          onClick={onReset}
          className="text-gray-400 hover:text-gray-100"
        >
          Reset Code
        </Button>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-base"
            onClick={onRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                Выполнение...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Запустить код
              </>
            )}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-base"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                Отправка...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Отправить решение
              </>
            )}
          </Button>
        </div>
      </div>
      
      {testResults.length > 0 && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-white text-lg font-medium mb-2">Test Results</h3>
          <div className="space-y-2">
            {testResults.map((result, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-md ${
                  result.passed ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                }`}
              >
                <div className="flex items-start">
                  <div className={`rounded-full p-1 mr-2 ${result.passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {result.passed ? 
                      <CheckCircle className="h-5 w-5 text-green-500" /> : 
                      <span className="h-5 w-5 text-red-500 flex items-center justify-center">✖</span>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Test Case {idx + 1}</p>
                    {!result.passed && result.expected && result.output && (
                      <div className="mt-2 text-xs">
                        <p className="text-gray-400">Input: <code className="text-gray-300 bg-gray-700/50 px-1 py-0.5 rounded">{result.testCase?.input || 'N/A'}</code></p>
                        <p className="text-gray-400 mt-1">Expected: <code className="text-green-300 bg-gray-700/50 px-1 py-0.5 rounded">{result.expected}</code></p>
                        <p className="text-gray-400 mt-1">Actual: <code className="text-red-300 bg-gray-700/50 px-1 py-0.5 rounded">{result.output}</code></p>
                      </div>
                    )}
                    {result.error && (
                      <p className="text-xs text-red-400 mt-1 bg-gray-700/50 p-2 rounded">{result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
