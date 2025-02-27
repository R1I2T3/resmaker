import React from "react";
import { INITIAL_THEME_COLOR } from "@/client/colors";
import SkeletonLoader from "./skeleton-loader";
import { ResumeDataType } from "@/client/type";

interface ProjectProps {
  isLoading: boolean;
  resumeInfo: ResumeDataType | undefined;
}
const Project = ({ isLoading, resumeInfo }: ProjectProps) => {
  const themeColor = resumeInfo?.themeColor || INITIAL_THEME_COLOR;
  if (isLoading) return <SkeletonLoader />;
  return (
    <div className="w-full my-5">
      <h5
        className="text-left font-bold
  mb-2
  "
        style={{ color: themeColor }}
      >
        Projects
      </h5>
      <hr
        className="
      border-[1.5px] my-2
      "
        style={{
          borderColor: themeColor,
        }}
      />
      <div className="flex flex-col gap-2 min-h-9">
        {resumeInfo?.projects?.map((project, index) => (
          <div key={index}>
            <div
              className="flex items-start 
        justify-between mb-2"
            >
              <h5
                className="text-[15px] font-bold"
                style={{ color: themeColor }}
              >
                {project?.title}
              </h5>
              <span className="text-[13px]">
                {project?.startDate}
                {project?.startDate && " - "}
                {project?.endDate}
              </span>
            </div>
            <div
              style={{ fontSize: "13px" }}
              className="exp-preview leading-[14.6px]"
              dangerouslySetInnerHTML={{
                __html: project.description || "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;
