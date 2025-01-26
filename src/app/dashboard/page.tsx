import React from "react";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TrashListBox from "@/client/features/resumes/components/TrashListBox";
import AddResume from "@/client/features/resumes/components/AddResume";
import ResumeList from "@/client/features/resumes/components/ResumeList";
const DashBoardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/");
  }
  return (
    <div className="w-full">
      <div className="w-full mx-auto max-w-7xl py-5 px-5">
        <div className="flex items-start justify-between">
          <div className="shrink-0 flex items-center gap-3">
            {/* {Trash List} */}
            <TrashListBox />
          </div>
        </div>

        <div className="w-full pt-11">
          <h5
            className="text-xl font-semibold dark:text-inherit
          mb-3
          "
          >
            All Resume
          </h5>
          <div className="flex flex-wrap w-full gap-5">
            <AddResume />
            <ResumeList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
