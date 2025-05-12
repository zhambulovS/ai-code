
import { Card, CardContent } from "@/components/ui/card";

interface ProblemDescriptionProps {
  description: string;
  testCases: any[];
  timeLimit: number;
  memoryLimit: number;
}

export function ProblemDescription({ description, testCases, timeLimit, memoryLimit }: ProblemDescriptionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
          
          {testCases && testCases.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Примеры:</h3>
              
              {testCases.filter(tc => tc.is_sample).map((example, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Вход:</span> {example.input.replace(/\n/g, ', ')}
                    </div>
                    <div>
                      <span className="font-medium">Ожидаемый выход:</span> {example.expected_output}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold">Ограничения:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ограничение по времени: {timeLimit} мс</li>
              <li>Ограничение по памяти: {memoryLimit / 1024} МБ</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
