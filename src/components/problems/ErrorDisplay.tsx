
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SeedDatabaseButton } from "@/components/admin/SeedDatabaseButton";

interface ErrorDisplayProps {
  onRetry: () => void;
}

export function ErrorDisplay({ onRetry }: ErrorDisplayProps) {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center text-red-600">
          {t("problems.errorTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center">
          {t("problems.errorDescription")}
        </p>
        <div className="flex justify-center mt-4">
          <Button onClick={onRetry}>{t("common.retry") || "Retry"}</Button>
        </div>
        <div className="flex justify-center mt-4">
          <SeedDatabaseButton />
        </div>
      </CardContent>
    </Card>
  );
}
