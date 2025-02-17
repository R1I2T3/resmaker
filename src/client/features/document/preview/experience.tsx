import { ResumeDataType } from "@/client/type";
import React from "react";
import SkeletonLoader from "./skeleton-loader";
import { INITIAL_THEME_COLOR } from "@/client/colors";
interface ExperienceProps {
  isLoading: boolean;
  resumeInfo: ResumeDataType | undefined;
}
const Experience = ({ isLoading, resumeInfo }: ExperienceProps) => {
  const themeColor = resumeInfo?.themeColor || INITIAL_THEME_COLOR;

  if (isLoading) return <SkeletonLoader />;
  console.log("This is resume info\n", resumeInfo);
  return (
    <div className="w-full my-5">
      <h5
        className="text-left font-bold
      mb-2
      "
        style={{ color: themeColor }}
      >
        Professional Experience
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
        {resumeInfo?.experiences?.map((experience, index) => (
          <div key={index}>
            <h5 className="text-[15px] font-bold" style={{ color: themeColor }}>
              {experience?.title}
            </h5>
            <div
              className="flex items-start 
            justify-between mb-2"
            >
              <h5 className="text-[13px]">
                {experience?.companyName}
                {experience?.companyName && experience?.city && ", "}
                {experience?.city}
                {experience?.city && experience?.state && ", "}
                {experience?.state}
              </h5>
              <span className="text-[13px]">
                {experience?.startDate}
                {experience?.startDate && " - "}
                {experience?.currentlyWorking ? "Present" : experience?.endDate}
              </span>
            </div>
            <div
              style={{ fontSize: "13px" }}
              className="exp-preview leading-[14.6px]"
              dangerouslySetInnerHTML={{
                __html: experience?.workSummary || "",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
