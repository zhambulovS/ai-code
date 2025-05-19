
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface ProblemDescriptionProps {
  description: string;
  testCases: any[];
  timeLimit: number;
  memoryLimit: number;
}

export function ProblemDescription({ description, testCases, timeLimit, memoryLimit }: ProblemDescriptionProps) {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
          
          {testCases && testCases.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("problem.examples")}:</h3>
              
              {testCases.filter(tc => tc.is_sample).map((example, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">{t("problem.inputFormat")}:</span> {example.input.replace(/\n/g, ', ')}
                    </div>
                    <div>
                      <span className="font-medium">{t("problem.outputFormat")}:</span> {example.expected_output}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold">{t("problem.constraints")}:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>{t("problem.timeLimit")}: {timeLimit} ms</li>
              <li>{t("problem.memoryLimit")}: {memoryLimit / 1024} MB</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
