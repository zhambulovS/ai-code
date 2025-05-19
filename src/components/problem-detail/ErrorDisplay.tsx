
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ErrorDisplayProps {
  onReturn: () => void;
}

export function ErrorDisplay({ onReturn }: ErrorDisplayProps) {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">{t("problem.notFound", "Problem not found")}</h1>
      <p className="mb-6">{t("problem.doesNotExist", "The requested problem does not exist or was removed.")}</p>
      <Button onClick={onReturn}>{t("problem.returnToList", "Return to problems list")}</Button>
    </div>
  );
}
