import React from "react";
import ResMakerIcon from "./ResMakerIcon";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
const NavBar = () => {
  return (
    <nav className="flex justify-between items-center flex-wrap  px-4 py-3 bg-[#ed5f00] w-full">
      <div className="flex items-center flex-shrink-0 text-white mr-6 gap-3">
        <ResMakerIcon />
        <h1 className="text-2xl font-bold leading-[6px] hidden lg:block">
          ResMaker
        </h1>
      </div>
      <div className="flex gap-3 items-center">
        <ModeToggle />
        <Link
          href="/auth/sign-on"
          className=" bg-[#3a76f0] text-white px-4 py-2  rounded-md"
        >
          Sign On
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
