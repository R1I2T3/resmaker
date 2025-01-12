"use client";

import React from "react";
import { User } from "better-auth";
import { usePathname } from "next/navigation";
const ShowMessage = ({ user }: { user?: User }) => {
  const pathname = usePathname();
  return (
    <div>
      {pathname === "/dashboard" && user ? (
        <h1 className="text-2xl font-bold leading-[6px] hidden lg:block text-center text-primary">
          Hello, {user.name}
        </h1>
      ) : (
        <h1 className="text-2xl font-bold leading-[6px] hidden lg:block text-primary">
          ResMaker
        </h1>
      )}
    </div>
  );
};

export default ShowMessage;
