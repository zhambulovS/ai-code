
import { useTranslation } from "react-i18next";

interface HintHistoryItemProps {
  hint: {
    created_at: string;
    generated_hint: string;
  };
}

export function HintHistoryItem({ hint }: HintHistoryItemProps) {
  const { t } = useTranslation();
  
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {new Date(hint.created_at).toLocaleString()}:
      </div>
      <div className="whitespace-pre-wrap">{hint.generated_hint}</div>
    </div>
  );
}
