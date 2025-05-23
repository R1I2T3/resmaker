import React, { useState } from "react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  Separator,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
} from "react-simple-wysiwyg";
import { Label } from "./ui/label";
// import { Button } from "./ui/button";
// import { Loader, Sparkles } from "lucide-react";

// import { AIChatSession } from "@/client/lib/ai";
// import { toast } from "sonner";
// const PROMPT = `Given the job title "{jobTitle}",
//  create 6-7 concise and personal bullet points in
//  HTML stringify format that highlight my key
//  skills, relevant technologies, and significant
//  contributions in that role. Do not include
//  the job title itself in the output. Provide
//  only the bullet points inside an unordered
//  list.`;

const RichTextEditor = (props: {
  jobTitle: string | null;
  initialValue: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEditorChange: (e: any) => void;
  isProject?: boolean;
}) => {
  const { initialValue, onEditorChange, isProject } = props;

  // const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  // const GenerateSummaryFromAI = async () => {
  //   try {
  //     if (!jobTitle) {
  //       toast.error("Please provide a job title to generate summary");
  //       return;
  //     }
  //     setLoading(true);
  //     const prompt = PROMPT.replace("{jobTitle}", jobTitle);
  //     const result = await AIChatSession.sendMessage(prompt);
  //     const responseText = await result.response.text();
  //     const validJsonArray = JSON.parse(`[${responseText}]`);

  //     setValue(validJsonArray?.[0]);
  //     onEditorChange(validJsonArray?.[0]);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to generate summary");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      <div
        className="flex items-center 
      justify-between my-2"
      >
        <Label>{!isProject ? "Work Summary" : "Project Description"}</Label>
        {/* <Button
          variant="outline"
          type="button"
          className="gap-1"
          disabled={loading}
          onClick={() => GenerateSummaryFromAI()}
        >
          <>
            <Sparkles size="15px" className="text-orange-500" />
            Enhance with AI
          </>
          {loading && <Loader size="13px" className="animate-spin" />}
        </Button> */}
      </div>

      <EditorProvider>
        <Editor
          value={value}
          containerProps={{
            style: {
              resize: "vertical",
              lineHeight: 1.2,
              fontSize: "13.5px",
            },
          }}
          onChange={(e) => {
            setValue(e.target.value);
            onEditorChange(e.target.value);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;
