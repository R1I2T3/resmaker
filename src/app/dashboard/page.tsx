import React from "react";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const DashBoardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/");
  }
  return (
    <div className="w-full">
      <div className="w-full mx-auto max-w-7xl py-5 px-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">ResMaker</h1>
            <p className="text-base dark:text-inherit">
              Create your own custom resume with AI & Subscribe to the channel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
