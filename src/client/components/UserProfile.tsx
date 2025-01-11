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
const UserProfile = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user.image ? (
          <img
            alt="profile"
            src={user.image}
            className="size-[2rem] rounded-full"
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
