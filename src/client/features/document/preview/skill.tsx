import React from "react";
import { ResumeDataType } from "@/client/type";
import SkeletonLoader from "./skeleton-loader";
import { INITIAL_THEME_COLOR } from "@/client/colors";
interface SkillProps {
  resumeInfo: ResumeDataType | undefined;
  isLoading: boolean;
}
const Skill = ({ resumeInfo, isLoading }: SkillProps) => {
  const themeColor = resumeInfo?.themeColor || INITIAL_THEME_COLOR;

  if (isLoading) {
    return <SkeletonLoader />;
  }
  return (
    <div className="w-full my-5">
      <h5 className="font-bold mb-2" style={{ color: themeColor }}>
        Skills
      </h5>
      <hr className="border-[1.5px] my-2" style={{ borderColor: themeColor }} />

      <div className="grid grid-cols-4 gap-4 pt-4 my-2 min-h-9 list-disc">
        {resumeInfo?.skills?.map((skill, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 p-2 rounded-md shadow-sm"
          >
            <h5 className="text-sm font-medium text-gray-700">{skill?.name}</h5>
            {skill?.rating && skill?.name ? (
              <div className="relative w-[120px] h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    background: themeColor,
                    width: skill?.rating * 20 + "%",
                  }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skill;
