import { useResumeContext } from "@/client/providers/resume-info-provider";
import React, { useState, useEffect } from "react";
import { generateThumbnail } from "@/client/helper";
import useUpdateDocument from "../../resumes/hooks/use-update-document";
import { Button } from "@/client/components/ui/button";
import { Plus, X, Loader } from "lucide-react";
import { Label } from "@/client/components/ui/label";
import { Input } from "@/client/components/ui/input";
import RichTextEditor from "@/client/components/TextEditor";
const initialState = {
  id: undefined,
  docId: undefined,
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
  currentlyWorking: false,
};
const ExperienceForm = ({ handleNext }: { handleNext: () => void }) => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [experienceList, setExperienceList] = useState(() => {
    return resumeInfo?.experiences?.length
      ? resumeInfo.experiences
      : [initialState];
  });
  useEffect(() => {
    if (!resumeInfo) return;
    onUpdate({
      ...resumeInfo,
      experiences: experienceList,
    });
  }, [experienceList]);

  const addNewExperience = () => {
    setExperienceList([...experienceList, initialState]);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = [...experienceList];
    updatedExperience.splice(index, 1);
    setExperienceList(updatedExperience);
  };
  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;

    setExperienceList((prevState) => {
      const newExperienceList = [...prevState];
      newExperienceList[index] = {
        ...newExperienceList[index],
        [name]: value,
      };
      return newExperienceList;
    });
  };

  const handEditor = (value: string, name: string, index: number) => {
    setExperienceList((prevState) => {
      const newExperienceList = [...prevState];
      newExperienceList[index] = {
        ...newExperienceList[index],
        [name]: value,
      };
      return newExperienceList;
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const thumbnail = await generateThumbnail();
    const currentNo = resumeInfo?.currentPosition
      ? resumeInfo.currentPosition + 1
      : 1;
    await mutateAsync(
      {
        currentPosition: currentNo,
        thumbnail,
        experience: experienceList,
      },
      {
        onSuccess: () => {
          handleNext();
        },
      }
    );
  };
  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p className="text-sm">Add Previous Job Experience</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {experienceList.map((experience, index) => (
            <div key={index}>
              <div className="relative grid grid-cols-2 mb-5 pt-4 gap-3">
                {experienceList.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    className="size-[20px] text-center rounded-full absolute -top-3 -right-5 !bg-dark:!bg-gray-600 text-white"
                    size="icon"
                    onClick={() => removeExperience(index)}
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
                    value={experience?.title || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Company Name</Label>
                  <Input
                    name="companyName"
                    placeholder=""
                    required
                    value={experience?.companyName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">City</Label>
                  <Input
                    name="city"
                    placeholder=""
                    required
                    value={experience?.city || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <Label className="text-sm">State</Label>
                  <Input
                    name="state"
                    placeholder=""
                    required
                    value={experience?.state || ""}
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
                    value={experience?.startDate || ""}
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
                    value={experience?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="col-span-2 mt-1">
                  {/* {Work Summary} */}
                  <RichTextEditor
                    jobTitle={experience.title}
                    initialValue={experience.workSummary || ""}
                    onEditorChange={(value: string) =>
                      handEditor(value, "workSummary", index)
                    }
                    isProject={false}
                  />
                </div>
                {index === experienceList.length - 1 &&
                  experienceList.length < 5 && (
                    <Button
                      className="gap-1 mt-1 text-primary 
                          border-primary/50"
                      variant="outline"
                      type="button"
                      onClick={addNewExperience}
                    >
                      <Plus size="15px" />
                      Add More Experience
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

export default ExperienceForm;
