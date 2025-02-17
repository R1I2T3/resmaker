import React from "react";
import { ResumeDataType } from "@/client/type";
import { Skeleton } from "@/client/components/ui/skeleton";
interface SummaryType {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}
const Summary = ({ resumeInfo, isLoading }: SummaryType) => {
  return (
    <div className="w-full min-h-10">
      {isLoading ? (
        <Skeleton className="h-6 w-full" />
      ) : (
        <p className="text-[13px] !leading-4">
          {resumeInfo?.summary ||
            "Enter a brief description of your profession background."}
        </p>
      )}
    </div>
  );
};

export default Summary;
