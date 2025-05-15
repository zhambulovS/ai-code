
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  onReturn: () => void;
}

export function ErrorDisplay({ onReturn }: ErrorDisplayProps) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Проблема не найдена</h1>
      <p className="mb-6">Запрошенная проблема не существует или была удалена.</p>
      <Button onClick={onReturn}>Вернуться к списку задач</Button>
    </div>
  );
}
