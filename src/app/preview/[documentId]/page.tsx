"use client";

import React from "react";
import { ResumeInfoProvider } from "@/client/providers/resume-info-provider";
import ResumePreview from "@/client/features/document/ResumePreview";
const PreviewPage = () => {
  return (
    <ResumeInfoProvider isPublic={true}>
      <div className="w-[100vw] h-[100vh] mx-auto lg:w-[50dvw] mb-4">
        <ResumePreview />
      </div>
    </ResumeInfoProvider>
  );
};

export default PreviewPage;
