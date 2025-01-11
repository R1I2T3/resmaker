"use client";
import React from "react";
import { GoogleIcon } from "./icons";
import { GithubIcon } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { authClient } from "@/client/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const SignOnForm = () => {
  const GithubSignIn = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "github",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const GoogleSignIn = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "google",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <>
      <Button
        className="bg-background   bg-[#3a76f0] hover:bg-[#3a76f0]/90 lg:text-lg py-2 text-white"
        onClick={() => GoogleSignIn.mutateAsync()}
        disabled={GoogleSignIn.isPending}
      >
        <GoogleIcon />
        Sign on with Google
      </Button>
      <Button
        className="bg-background bg-[#3a76f0] hover:bg-[#3a76f0]/90  lg:text-lg py-2 text-white"
        onClick={() => GithubSignIn.mutateAsync()}
        disabled={GithubSignIn.isPending}
      >
        <GithubIcon />
        Sign on with Github
      </Button>
    </>
  );
};

export default SignOnForm;
