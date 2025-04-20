import React from "react";
import SkeletonLoader from "./skeleton-loader";
import { INITIAL_THEME_COLOR } from "@/client/colors";
import { ResumeDataType } from "@/client/type";
interface ProjectProps {
  isLoading: boolean;
  resumeInfo: ResumeDataType | undefined;
}
const Certificate = ({ isLoading, resumeInfo }: ProjectProps) => {
  const themeColor = resumeInfo?.themeColor || INITIAL_THEME_COLOR;
  if (isLoading) return <SkeletonLoader />;
  return (
    <div className="w-full my-5">
      <h5
        className="font-bold
mb-2
"
        style={{ color: themeColor }}
      >
        Achievement&Certification
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
        {resumeInfo?.certificates?.map((certificate, index) => (
          <div key={index}>
            <div className="flex justify-between">
              <h5 className="text-sm font-bold" style={{ color: themeColor }}>
                {certificate?.title}
              </h5>
              <span className="text-[13px]">{certificate.date}</span>
            </div>

            <p className="text-[13px] my-2">{certificate?.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;
