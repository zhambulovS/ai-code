
import { useState, useEffect } from "react";
import { 
  generateHint, 
  getHintHistory, 
  getPersonalizedHint,
  type HintRequest 
} from "@/services/hintService";

export function useHints(problemId: number, isLoggedIn: boolean) {
  const [hint, setHint] = useState<string | null>(null);
  const [hintHistory, setHintHistory] = useState<any[]>([]);
  const [personalizedHint, setPersonalizedHint] = useState<string | null>(null);
  const [isLoadingPersonalized, setIsLoadingPersonalized] = useState(false);

  // Load hint history when dialog opens or login status changes
  useEffect(() => {
    if (isLoggedIn && problemId > 0) {
      loadHintHistory();
    }
  }, [isLoggedIn, problemId]);

  const loadHintHistory = async () => {
    try {
      const history = await getHintHistory(problemId);
      setHintHistory(history);
      return history;
    } catch (error) {
      console.error("Error loading hint history:", error);
      return [];
    }
  };

  const generateNewHint = async (hintRequest: HintRequest) => {
    try {
      const result = await generateHint(hintRequest);
      setHint(result.hint);
      
      // Update history after getting a new hint
      await loadHintHistory();
    } catch (error) {
      console.error("Error generating hint:", error);
      throw error;
    }
  };

  const handleGetPersonalizedHint = async (problemDifficulty: string = "medium") => {
    if (!isLoggedIn) return;
    
    setIsLoadingPersonalized(true);
    try {
      const personalHint = await getPersonalizedHint(
        "current-user-id", // In a real implementation, this would be the actual user ID
        problemId,
        problemDifficulty,
        hintHistory.length
      );
      setPersonalizedHint(personalHint);
    } catch (error) {
      console.error("Error getting personalized hint:", error);
    } finally {
      setIsLoadingPersonalized(false);
    }
  };

  return {
    hint,
    hintHistory,
    personalizedHint,
    isLoadingPersonalized,
    loadHintHistory,
    generateNewHint,
    handleGetPersonalizedHint
  };
}
