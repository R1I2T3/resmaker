"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import { Button } from "@/client/components/ui/button";
import { Trash2, Undo, Loader, Dot, FileText, Search } from "lucide-react";
import { Skeleton } from "@/client/components/ui/skeleton";
import { Input } from "@/client/components/ui/input";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import useGetDocuments from "../hooks/use-get-documents";
import useRestore from "../hooks/use-restore";
import { toast } from "sonner";
const TrashListBox = () => {
  const router = useRouter();
  const { data, isLoading } = useGetDocuments(true);
  const { mutateAsync, isPending } = useRestore();
  const [search, setSearch] = useState<string>("");
  const resumes = data?.data ?? [];
  const filteredDocuments = resumes?.filter((doc) => {
    return doc.title?.toLowerCase()?.includes(search?.toLowerCase());
  });
  const onClick = (docId: string) => {
    router.push(`/dashboard/${docId}/`);
  };
  const onRestore = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    docId: string,
    status: string
  ) => {
    event.stopPropagation();
    mutateAsync(
      {
        status: status,
        documentId: docId,
        id: docId,
      },
      {
        onSuccess: () => {
          toast.success("Document restored successfully");
        },
      }
    );
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="text-[15px] gap-[2px]
           items-center"
          variant="outline"
        >
          <Trash2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background 
        w-[22rem] !px-2"
        align="end"
        alignOffset={0}
        forceMount
      >
        {isLoading ? (
          <div
            className="w-full flex flex-col 
        gap-2 pt-3"
          >
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
          </div>
        ) : (
          <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
              <Search className="w-4 h-4" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 px-2 bg-secondary "
                placeholder="Filter by resume title"
              />
            </div>
            <div className="mt-2 px-1 pb-1">
              <p
                className="hidden last:block text-xs
            text-center text-muted-foreground
            "
              >
                No documents found
              </p>

              {filteredDocuments?.map((doc) => (
                <div
                  key={doc.id}
                  role="button"
                  onClick={() => onClick(doc.id)}
                  className="
                      text-sm rounded-s w-full hover:bg-primary/5
                      flex items-center justify-between py-1 px-1
                      "
                >
                  <div className="flex items-start gap-1">
                    <FileText size="15px" className="mt-[3px]" />
                    <div className="flex flex-col">
                      <h5
                        className="font-semibold text-sm
                       truncate block w-[200px]"
                      >
                        {doc.title}
                      </h5>
                      <div
                        className="flex items-center
                       !text-[12px]"
                      >
                        <span
                          className="flex items-center 
                        capitalize gap-[2px]"
                        >
                          {doc.status}
                        </span>
                        <Dot size="15px" />
                        <span className="items-center">
                          {doc.updatedAt &&
                            format(doc.updatedAt, "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      role="button"
                      onClick={(e) => onRestore(e, doc.id, doc.status)}
                      className="rounded-sm
                               hover:bg-neutral-200
                       w-6 h-6 flex 
                      items-center justify-center 
                       dark:hover:bg-gray-700"
                    >
                      {isPending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Undo className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default TrashListBox;
