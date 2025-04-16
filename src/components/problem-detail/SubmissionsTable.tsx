
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Submission } from "@/services/problemsService";

interface SubmissionsTableProps {
  submissions?: Submission[];
  isLoading: boolean;
  user: any;
  onLogin: () => void;
}

export function SubmissionsTable({ submissions, isLoading, user, onLogin }: SubmissionsTableProps) {
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="mb-4">Чтобы видеть историю своих решений, необходимо войти в систему.</p>
          <Button onClick={onLogin}>Войти</Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>У вас еще нет решений для этой задачи.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Статус</th>
                <th className="px-4 py-3 text-left">Язык</th>
                <th className="px-4 py-3 text-left">Время</th>
                <th className="px-4 py-3 text-left">Память</th>
                <th className="px-4 py-3 text-left">Дата отправки</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      submission.status === "accepted" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {submission.status === "accepted" ? "Принято" : "Ошибка"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{submission.language}</td>
                  <td className="px-4 py-3 text-sm">{submission.execution_time || "N/A"} мс</td>
                  <td className="px-4 py-3 text-sm">{submission.memory_used ? `${(submission.memory_used / 1024).toFixed(2)} МБ` : "N/A"}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(submission.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
