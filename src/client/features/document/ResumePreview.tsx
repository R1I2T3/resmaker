"use client";
import { useResumeContext } from "@/client/providers/resume-info-provider";
import React from "react";
import { cn } from "@/lib/utils";
import PersonalInfo from "./preview/personal-info";
import Summary from "./preview/summary";
import Experience from "./preview/experience";
import Education from "./preview/education";
import Skill from "./preview/skill";
const ResumePreview = () => {
  const { resumeInfo, isLoading } = useResumeContext();
  return (
    <div
      id="resume-preview-id"
      className={cn(`
    shadow-lg bg-white w-full flex-[1.02]
    h-full p-10 !font-open-sans
    dark:border dark:bg-card 
    dark:border-b-gray-800 
    dark:border-x-gray-800
    `)}
      style={{
        borderTop: `13px solid ${resumeInfo?.themeColor}`,
      }}
    >
      <PersonalInfo isLoading={isLoading} resumeInfo={resumeInfo} />
      <Summary />
      <Experience isLoading={isLoading} resumeInfo={resumeInfo} />
      <Education isLoading={isLoading} resumeInfo={resumeInfo} />
      <Skill />
    </div>
  );
};

export default ResumePreview;
