import { ResumeDataType } from "@/client/type";
import React from "react";
import { INITIAL_THEME_COLOR } from "@/client/colors";
import SkeletonLoader from "./skeleton-loader";
interface EducationProps {
  isLoading: boolean;
  resumeInfo: ResumeDataType | undefined;
}
const Education = ({ isLoading, resumeInfo }: EducationProps) => {
  const themeColor = resumeInfo?.themeColor || INITIAL_THEME_COLOR;
  if (isLoading) {
    return <SkeletonLoader />;
  }
  return (
    <div className="w-full my-5">
      <h5
        className="font-bold
  mb-2
  "
        style={{ color: themeColor }}
      >
        Education
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
        {resumeInfo?.educations?.map((education, index) => (
          <div key={index}>
            <h5 className="text-sm font-bold" style={{ color: themeColor }}>
              {education?.universityName}
            </h5>
            <div className="flex items-start justify-between">
              <h5 className="text-[13px]">
                {education?.degree}
                {education?.degree && education?.major && " in "}
                {education?.major}
              </h5>
              <span className="text-[13px]">
                {education?.startDate}
                {education?.startDate && " - "}
                {education?.endDate}
              </span>
            </div>
            <p className="text-[13px] my-2">{education?.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
