import React, { useState, useEffect } from "react";
import { useResumeContext } from "@/client/providers/resume-info-provider";
import useUpdateDocument from "../../resumes/hooks/use-update-document";
import { Button } from "@/client/components/ui/button";
import { Loader, X } from "lucide-react";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import RichTextEditor from "@/client/components/TextEditor";
import { Plus } from "lucide-react";
import { generateThumbnail } from "@/client/helper";
const initialState = {
  id: undefined,
  docId: undefined,
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  techUsed: "",
} as const;
const ProjectForm = ({ handleNext }: { handleNext: () => void }) => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [projectList, setProjectList] = useState(() => {
    return resumeInfo?.projects?.length ? resumeInfo.projects : [initialState];
  });
  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      projects: projectList,
    });
  }, [projectList]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const thumbnail = await generateThumbnail();
    await mutateAsync(
      {
        projects: projectList,
        thumbnail,
      },
      {
        onSuccess: () => {
          handleNext();
        },
      }
    );
  };
  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;

    setProjectList((prevState) => {
      const newProjectList = [...prevState];
      newProjectList[index] = {
        ...newProjectList[index],
        [name]: value,
      };
      return newProjectList;
    });
  };
  const handEditor = (value: string, name: string, index: number) => {
    setProjectList((prevState) => {
      const newExperienceList = [...prevState];
      newExperienceList[index] = {
        ...newExperienceList[index],
        [name]: value,
      };
      return newExperienceList;
    });
  };
  const removeProject = (index: number) => {
    const updatedExperience = [...projectList];
    updatedExperience.splice(index, 1);
    setProjectList(updatedExperience);
  };
  const addProject = () => {
    setProjectList([...projectList, initialState]);
  };

  return (
    <div className="w-full">
      <h2 className="font-bold text-lg">Personal projects</h2>
      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {projectList.map((project, index) => (
            <div key={index}>
              <div className="relative grid grid-cols-2 mb-5 pt-4 gap-3">
                {projectList.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    className="size-[20px] text-center rounded-full absolute -top-3 -right-5 !bg-dark:!bg-gray-600 text-white"
                    size="icon"
                    onClick={() => removeProject(index)}
                  >
                    <X size={13} />
                  </Button>
                )}
                <div>
                  <Label className="text-sm">Position title</Label>
                  <Input
                    name="title"
                    placeholder=""
                    required
                    value={project?.title || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Tech Used</Label>
                  <Input
                    name="techUsed"
                    placeholder="Tech Used in project"
                    required
                    value={project?.techUsed || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Start Date</Label>
                  <Input
                    name="startDate"
                    type="date"
                    placeholder=""
                    required
                    value={project.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">End Date</Label>
                  <Input
                    name="endDate"
                    type="date"
                    placeholder=""
                    required
                    value={project.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="col-span-2 mt-1">
                  {/* {Work Summary} */}
                  <RichTextEditor
                    jobTitle={project.title}
                    initialValue={project.description || ""}
                    onEditorChange={(value: string) =>
                      handEditor(value, "workSummary", index)
                    }
                  />
                </div>
                {index === projectList.length - 1 && projectList.length < 5 && (
                  <Button
                    className="gap-1 mt-1 text-primary 
                        border-primary/50"
                    variant="outline"
                    type="button"
                    onClick={addProject}
                  >
                    <Plus size="15px" />
                    Add More Projects
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader size="15px" className="animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProjectForm;
