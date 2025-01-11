import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { CircleUserRound } from "lucide-react";
import SignOnForm from "@/client/features/auth/components/sign-on-form";
const SignOn = () => {
  return (
    <div className="h-full w-full flex justify-center items-center flex-grow ">
      <Card className="w-[90%] md:w-[40%] lg:w-[30%] ">
        <CardHeader className="flex flex-col mx-auto w-full items-center gap-2">
          <CircleUserRound size={48} />
          <CardTitle className="text-xl leading-3 font-bold">
            Sign on to ResMaker
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 w-full">
          <SignOnForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignOn;
