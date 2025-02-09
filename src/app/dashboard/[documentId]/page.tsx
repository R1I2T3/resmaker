import React from "react";
import { ResumeInfoProvider } from "@/client/providers/resume-info-provider";
import EditResume from "@/client/features/document/EditResume";
const Document = () => {
  return (
    <ResumeInfoProvider>
      <EditResume />
    </ResumeInfoProvider>
  );
};

export default Document;
