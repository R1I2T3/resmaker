import React, { useCallback, useState } from "react";
import { StatusType } from "@/client/type";
import { Button } from "@/client/components/ui/button";
import { DownloadCloud } from "lucide-react";
import { toast } from "sonner";
import { formatFileName } from "@/client/helper";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const Download = (props: {
  title: string;
  isLoading: boolean;
  status?: StatusType;
}) => {
  const { title, status, isLoading } = props;
  const [loading, setLoading] = useState(false);
  const handleDownload = useCallback(async () => {
    const resumeElement = document.getElementById("resume-preview-id");
    if (!resumeElement) {
      toast.error("Could not Download");
      return;
    }
    setLoading(true);
    const fileName = formatFileName(title);
    try {
      const canvas = await html2canvas(resumeElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download file");
    } finally {
      setLoading(false);
    }
  }, [title]);
  return (
    <Button
      disabled={isLoading || loading || status === "archived" ? true : false}
      variant="secondary"
      className="bg-white border gap-1
               dark:bg-gray-800 !p-2
                min-w-9 lg:min-w-auto lg:p-4"
      onClick={handleDownload}
    >
      <div className="flex items-center gap-1">
        <DownloadCloud size="17px" />
        <span className="hidden lg:flex">
          {loading ? "Generating PDF" : "Download Resume"}
        </span>
      </div>
    </Button>
  );
};

export default Download;
