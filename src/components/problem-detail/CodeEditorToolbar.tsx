
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HintButton } from "./HintButton";

interface CodeEditorToolbarProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onReset: () => void;
  problemId: number;
  code: string;
  testResults: any[];
  isLoggedIn: boolean;
}

export function CodeEditorToolbar({ 
  language, 
  onLanguageChange, 
  onReset,
  problemId,
  code,
  testResults,
  isLoggedIn
}: CodeEditorToolbarProps) {
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" }
  ];

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Редактор кода</h3>
      <div className="flex items-center gap-3">
        <HintButton 
          problemId={problemId}
          code={code}
          language={language}
          testResults={testResults}
          isLoggedIn={isLoggedIn}
        />
      
        <Button variant="outline" onClick={onReset}>
          Сбросить
        </Button>
        
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Выберите язык" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
