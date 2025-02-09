import { Button } from "@/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useResumeContext } from "@/client/providers/resume-info-provider";
import { Trash2, Loader, Redo } from "lucide-react";
import useUpdateDocument from "../resumes/hooks/use-update-document";
import { toast } from "sonner";
import { StatusType } from "@/client/type";
const MoreOption = () => {
  const router = useRouter();
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const handleClick = useCallback(
    async (status: StatusType) => {
      if (!resumeInfo) return;
      await mutateAsync(
        {
          status: status,
        },
        {
          onSuccess: () => {
            onUpdate({
              ...resumeInfo,
              status: status,
            });
            router.replace(`/dashboard/`);
            toast.success("Moved to trash successfully");
          },
          onError() {
            toast.error("Failed to update status");
          },
        }
      );
    },
    [mutateAsync, onUpdate, resumeInfo, router]
  );
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"secondary"}
            size="icon"
            className="bg-white border
             dark:bg-gray-800"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            {resumeInfo?.status === "archived" ? (
              <Button
                variant="ghost"
                className="gap-1 !py-2 !cursor-pointer"
                disabled={isPending}
                onClick={() => handleClick("private")}
              >
                <Redo size="15px" />
                Retore resume
                {isPending && <Loader size="15px" className="animate-spin" />}
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="gap-1  !py-2 !cursor-pointer"
                disabled={isPending}
                onClick={() => handleClick("archived")}
              >
                <Trash2 size="15px" />
                Move to Trash
                {isPending && <Loader size="15px" className="animate-spin" />}
              </Button>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MoreOption;
