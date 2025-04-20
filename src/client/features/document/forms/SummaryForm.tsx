import { useResumeContext } from "@/client/providers/resume-info-provider";
import React, { useState, useCallback } from "react";
import useUpdateDocument from "../../resumes/hooks/use-update-document";
import { ResumeDataType } from "@/client/type";
import { toast } from "sonner";
import { AIChatSession } from "@/client/lib/ai";
import { Loader, Sparkles } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Label } from "@/client/components/ui/label";
import { Textarea } from "@/client/components/ui/textarea";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/client/components/ui/card";
import { generateThumbnail } from "@/client/helper";
interface GeneratesSummaryType {
  fresher: string;
  mid: string;
  experienced: string;
}

const prompt = `Job Title: {jobTitle}. Based on the job title, please generate concise 
and complete summaries for my resume in JSON format, incorporating the following experience
levels: fresher, mid, and experienced. Each summary should be limited to 3 to 4 lines,
reflecting a personal tone and showcasing specific relevant programming languages, technologies,
frameworks, and methodologies without any placeholders or gaps. Ensure that the summaries are
engaging and tailored to highlight unique strengths, aspirations, and contributions to collaborative
projects, demonstrating a clear understanding of the role and industry standards.`;
const SummaryForm = ({ handleNext }: { handleNext: () => void }) => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] =
    useState<GeneratesSummaryType | null>(null);
  const handleChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    const resumeDataInfo = resumeInfo as ResumeDataType;
    const updatedInfo = {
      ...resumeDataInfo,
      summary: value,
    };
    onUpdate(updatedInfo);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const thumbnail = await generateThumbnail();
    const currentNo = resumeInfo?.currentPosition
      ? resumeInfo?.currentPosition + 1
      : 1;
    await mutateAsync(
      {
        currentPosition: currentNo,
        thumbnail: thumbnail,
        summary: resumeInfo?.summary,
      },
      {
        onSuccess: () => {
          handleNext();
        },
      }
    );
  };
  const GenerateSummaryFromAI = async () => {
    try {
      const jobTitle = resumeInfo?.personalInfo?.jobTitle;
      if (!jobTitle) return;
      setLoading(true);
      const PROMPT = prompt.replace("{jobTitle}", jobTitle);
      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = await result.response.text();
      setAiGeneratedSummary(JSON?.parse(responseText));
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = useCallback(
    (summary: string) => {
      if (!resumeInfo) return;
      const resumeDataInfo = resumeInfo as ResumeDataType;
      const updatedInfo = {
        ...resumeDataInfo,
        summary: summary,
      };
      onUpdate(updatedInfo);
      setAiGeneratedSummary(null);
    },
    [onUpdate, resumeInfo]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Summary</h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-end justify-between">
            <Label>Add Summary</Label>
            <Button
              variant="outline"
              type="button"
              className="gap-1"
              disabled={loading || isPending}
              onClick={() => GenerateSummaryFromAI()}
            >
              <Sparkles size="15px" className="text-orange-500" />
              Enhance with AI
            </Button>
          </div>
          <Textarea
            className="mt-5 min-h-36"
            required
            value={resumeInfo?.summary || ""}
            onChange={handleChange}
          />

          {aiGeneratedSummary && (
            <div>
              <h5 className="font-semibold text-[15px] my-4">Suggestions</h5>
              {Object?.entries(aiGeneratedSummary)?.map(
                ([experienceType, summary], index) => (
                  <Card
                    role="button"
                    key={index}
                    className="my-4 bg-primary/5 shadow-none
                        border-primary/30
                      "
                    onClick={() => handleSelect(summary)}
                  >
                    <CardHeader className="py-2">
                      <CardTitle className="font-semibold text-md">
                        {experienceType?.charAt(0)?.toUpperCase() +
                          experienceType?.slice(1)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>{summary}</p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}

          <Button
            className="mt-4"
            type="submit"
            disabled={
              isPending || loading || resumeInfo?.status === "archived"
                ? true
                : false
            }
          >
            {isPending && <Loader size="15px" className="animate-spin" />}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SummaryForm;
