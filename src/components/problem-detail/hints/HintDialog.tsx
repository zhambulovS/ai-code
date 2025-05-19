
import { RotateCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { HintHistoryItem } from "./HintHistoryItem";

interface HintDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hint: string | null;
  hintHistory: any[];
  personalizedHint: string | null;
  isLoadingPersonalized: boolean;
  onGetPersonalizedHint: () => void;
  isLoggedIn: boolean;
}

export function HintDialog({
  isOpen,
  setIsOpen,
  hint,
  hintHistory,
  personalizedHint,
  isLoadingPersonalized,
  onGetPersonalizedHint,
  isLoggedIn
}: HintDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("problem.hint")}</DialogTitle>
          <DialogDescription>
            {hintHistory.length >= 3 ? (
              <div className="text-amber-600">
                {t("problem.hintLimitReached")}
              </div>
            ) : (
              <div>
                {t("problem.hintsUsed", { count: hintHistory.length, max: 3 })}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {personalizedHint && (
          <Card className="border-primary/20 bg-primary/5 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <BookOpen className="h-4 w-4 text-primary mr-2" />
                <h4 className="text-sm font-medium">{t("problem.personalizedAdvice")}</h4>
              </div>
              <p className="text-sm">{personalizedHint}</p>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-4 space-y-4">
          {hintHistory.map((h, i) => (
            <HintHistoryItem key={i} hint={h} />
          ))}
          
          {hint && hintHistory.length === 0 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md whitespace-pre-wrap">
              {hint}
            </div>
          )}
          
          {hintHistory.length === 0 && !hint && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              {t("common.loading")}...
            </div>
          )}
        </div>
        
        {isLoadingPersonalized && (
          <div className="flex justify-center my-4">
            <RotateCw className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
        
        {hintHistory.length < 3 && isLoggedIn && (
          <Button 
            variant="outline" 
            className="w-full mt-2" 
            onClick={onGetPersonalizedHint}
            disabled={isLoadingPersonalized}
          >
            {isLoadingPersonalized ? (
              <RotateCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <BookOpen className="h-4 w-4 mr-2" />
            )}
            {t("problem.getPersonalizedAdvice")}
          </Button>
        )}
        
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>
            {t("common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
