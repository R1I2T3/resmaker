import React, { useCallback, useState } from "react";
import { useResumeContext } from "@/client/providers/resume-info-provider";
import useUpdateDocument from "../resumes/hooks/use-update-document";
import { useParams } from "next/navigation";
import useOrigin from "@/client/hooks/use-origin";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import { Button } from "@/client/components/ui/button";
import {
  ShareIcon,
  ChevronDown,
  Loader,
  Check,
  Copy,
  Globe,
} from "lucide-react";
import { StatusType } from "@/client/type";
import { toast } from "sonner";
const Share = () => {
  const param = useParams();
  const documentId = param.documentId || "";
  const { resumeInfo, onUpdate, isLoading } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  const url = `${origin}/preview/${documentId}/resume`;
  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  const handleClick = useCallback(
    async (status: StatusType) => {
      if (!resumeInfo) return;
      await mutateAsync(
        { status: status },
        {
          onSuccess: () => {
            onUpdate({
              ...resumeInfo,
              status: status,
            });
            toast.success(`Status set to ${status} successfully`);
          },
          onError: () => {
            toast.error("Failed to update status of resume");
          },
        }
      );
    },
    [resumeInfo, onUpdate]
  );
  return (
    <Popover>
      <PopoverTrigger disabled={resumeInfo?.status === "archived"} asChild>
        <Button
          disabled={
            isLoading || resumeInfo?.status === "archived" ? true : false
          }
          variant="secondary"
          className="bg-white border gap-1
                   dark:bg-gray-800 !p-2
                    lg:w-auto lg:p-4"
        >
          <div className="flex items-center gap-1">
            <ShareIcon size="17px" />
            <span className="flex">Share</span>
          </div>
          <ChevronDown size="14px" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background"
        align="end"
        alignOffset={0}
        forceMount
      >
        {resumeInfo?.status === "public" ? (
          <div className="space-y-3">
            <div
              className="
                        flex gap-x-2 items-center
                      "
            >
              <Globe size="15px" className="text-primary animate-pulse" />
              <p className="font-medium text-xs text-primary">
                This resume is shareable, copy the link!
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs 
              border rounded-l-md
              h-8 bg-muted truncate
              "
                value={url}
                readOnly
              />
              <Button
                className="h-8 rounded-l-none"
                disabled={copied}
                onClick={onCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <hr className="border-muted !mb-0" />
            <Button
              size="sm"
              variant="outline"
              className="w-full border-primary 
              text-primary  
              text-xs font-semibold"
              onClick={() => handleClick("private")}
              disabled={isPending}
            >
              {isPending && <Loader size="15px" className="animate-spin" />}
              Private
            </Button>
          </div>
        ) : (
          <div
            className="w-full flex flex-col gap-2
          items-center justify-center"
          >
            <Globe size="40px" />
            <div className="text-center mb-1">
              <h5 className="font-semibold text-sm">Set to Public</h5>
              <p className="text-xs text-muted-foreground">
                To share it with others, you need to make it public.
              </p>
            </div>
            <Button
              className="
            w-full h-8 !bg-black text-xs 
            dark:!bg-primary
            gap-1 font-semibold text-white
            "
              type="button"
              onClick={() => handleClick("public")}
            >
              {isPending && <Loader size="15px" className="animate-spin" />}
              Public
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Share;
