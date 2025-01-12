"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { User } from "better-auth";
import { CircleUserRound } from "lucide-react";
import { signOut } from "../lib/auth";
import Image from "next/image";
const UserProfile = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user.image ? (
          <Image
            alt="profile"
            src={user.image || "/img/profile.png"}
            className="size-[2rem] rounded-full"
            width={40}
            height={40}
            priority
          />
        ) : (
          <CircleUserRound size={40} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <a href="/profile">Profile</a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => signOut()}>Sign out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
