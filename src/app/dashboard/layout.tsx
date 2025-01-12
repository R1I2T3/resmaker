import React from "react";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const DashBoardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/");
  }
  return (
    <div className="h-full w-full flex justify-center items-center flex-grow">
      {children}
    </div>
  );
};

export default DashBoardLayout;
