import React from "react";
import ResMakerIcon from "./ResMakerIcon";
import { ModeToggle } from "./theme-toggle";
import UserProfile from "./UserProfile";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import ShowMessage from "./show-message";
const NavBar = async () => {
  const reqHeaders = await headers();
  const data = await auth.api.getSession({
    headers: reqHeaders,
  });
  return (
    <nav className="flex justify-between items-center flex-wrap  px-4 py-3  w-full">
      <div className="flex items-center flex-shrink-0 text-primary mr-6 gap-3 flex-grow">
        <ResMakerIcon />
        <ShowMessage user={data?.user} />
      </div>
      <div className="flex gap-3 items-center">
        <ModeToggle />
        {data?.user && <UserProfile user={data.user} />}
      </div>
    </nav>
  );
};

export default NavBar;
