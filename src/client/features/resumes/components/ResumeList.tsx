"use client";
import useGetDocuments from "../hooks/use-get-documents";
import { Loader, RotateCw } from "lucide-react";
import React, { Fragment } from "react";
import ResumeItem from "./ResumeItem";
import { ResumeType } from "./ResumeItem";
const ResumeList = () => {
  const { data, isLoading, isError, refetch } = useGetDocuments(false);
  const resumes = data?.data ?? [];
  return (
    <Fragment>
      {isLoading ? (
        <div
          className="
    flex items-center mx-5"
        >
          <Loader className="animate-spin text-black dark:text-white size-10" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center mx-5">
          <button className="flex items-center gap-1" onClick={() => refetch()}>
            <RotateCw size="1em" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <>
          {resumes
            ?.filter((resume) => resume.status !== "archived")
            .map((resume: ResumeType) => (
              <ResumeItem
                key={resume.id}
                id={resume.id}
                title={resume.title}
                status={resume.status}
                updatedAt={resume.updatedAt}
                themeColor={resume.themeColor}
                thumbnail={resume.thumbnail}
              />
            ))}
        </>
      )}
    </Fragment>
  );
};

export default ResumeList;
