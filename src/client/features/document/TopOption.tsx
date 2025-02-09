"use client";

import { useResumeContext } from "@/client/providers/resume-info-provider";
import React, { useCallback } from "react";
import useUpdateDocument from "../resumes/hooks/use-update-document";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import ResumeTitle from "./ResumeTitle";
import ThemeColor from "./ThemeColor";
import PreviewModal from "./PreviewModal";
import Download from "./Download";
import Share from "./Share";
import MoreOption from "./MoreOption";
const TopOption = () => {
  const { resumeInfo, isLoading, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const handleTitle = useCallback(
    (title: string) => {
      if (title === "Untitled Resume" && !title) return;
      if (resumeInfo) {
        onUpdate({
          ...resumeInfo,
          title: title,
        });
        mutateAsync(
          {
            title: title,
          },
          {
            onSuccess: () => {
              toast.success("Resume Title Updated Successfully");
            },
            onError: () => {
              toast.error("Failed to Update Resume Title");
            },
          }
        );
      }
    },
    [resumeInfo, onUpdate]
  );
  return (
    <>
      {resumeInfo?.status === "archived" && (
        <div
          className="
      absolute z-[9] inset-0 h-6 top-0
      bg-rose-500 text-center
      text-base p-2 text-white
      flex items-center gap-x-2 
      justify-center font-medium

      "
        >
          <AlertCircle size="16px" />
          This resume is in the trash bin
        </div>
      )}
      <div
        className="
          w-full flex items-center justify-between
          border-b pb-3
          "
      >
        <div className="flex items-center gap-2">
          <ResumeTitle
            isLoading={isLoading || isPending}
            initialTitle={resumeInfo?.title || ""}
            status={resumeInfo?.status}
            onSave={(value) => handleTitle(value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* {ThemeColor} */}
          <ThemeColor />

          {/* Preview Modal */}
          <PreviewModal />

          {/* Download Resume */}
          <Download
            title={resumeInfo?.title || "Unititled Resume"}
            status={resumeInfo?.status}
            isLoading={isLoading}
          />

          {/* Share Resume */}
          <Share />

          {/* More Option */}
          <MoreOption />
        </div>
      </div>
    </>
  );
};

export default TopOption;
