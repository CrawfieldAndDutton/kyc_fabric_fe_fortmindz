
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, AlertTriangle } from "lucide-react";

interface CreditBalanceProps {
  credits: number;
  totalUsed: number;
  lowThreshold?: number;
}

const CreditBalance: React.FC<CreditBalanceProps> = ({
  credits,
  totalUsed,
  lowThreshold = 100
}) => {
  const isLow = credits < lowThreshold;
  
  return (
    <div className="rounded-xl border bg-card shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">Credit Balance</h3>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Buy Credits
        </Button>
      </div>
      
      <div className="mb-2 flex justify-between items-baseline">
        <div className="text-3xl font-bold">{credits.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">
          {totalUsed.toLocaleString()} used
        </div>
      </div>
      
      <Progress value={(credits / (credits + totalUsed)) * 100} className="h-2 mb-4" />
      
      {isLow && (
        <div className="flex items-center gap-2 mt-4 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Your credit balance is running low. Consider purchasing more credits.</span>
        </div>
      )}
    </div>
  );
};

export default CreditBalance;
