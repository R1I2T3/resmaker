import React, { useCallback, useEffect } from "react";
import { useResumeContext } from "@/client/providers/resume-info-provider";
import { PersonalInfoType } from "@/client/type";
import useUpdateDocument from "../../resumes/hooks/use-update-document";
import { generateThumbnail } from "@/client/helper";
import { toast } from "sonner";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Button } from "@/client/components/ui/button";
import { Loader } from "lucide-react";
const initialState = {
  id: undefined,
  firstName: "",
  lastName: "",
  jobTitle: "",
  address: "",
  phone: "",
  email: "",
};

const PersonalInfoForm = ({ handleNext }: { handleNext: () => void }) => {
  const { resumeInfo, onUpdate } = useResumeContext();
  console.log(resumeInfo);
  const { mutateAsync, isPending } = useUpdateDocument();
  const [personalInfo, setPersonalInfo] =
    React.useState<PersonalInfoType>(initialState);
  useEffect(() => {
    if (!resumeInfo) {
      return;
    }
    if (resumeInfo?.personalInfo) {
      setPersonalInfo({
        ...(resumeInfo?.personalInfo || initialState),
      });
    }
  }, [resumeInfo?.personalInfo]);
  const handleChange = useCallback(
    (e: { target: { name: string; value: string } }) => {
      const { name, value } = e.target;
      setPersonalInfo((prev) => ({ ...prev, [name]: value }));
      if (!resumeInfo) return;
      onUpdate({
        ...resumeInfo,
        personalInfo: {
          ...resumeInfo.personalInfo,
          [name]: value,
        },
      });
    },
    [resumeInfo, onUpdate]
  );

  const handleSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      const thumbnail = await generateThumbnail();
      const currentNo = resumeInfo?.currentPosition
        ? resumeInfo?.currentPosition + 1
        : 1;
      await mutateAsync(
        {
          currentPosition: currentNo,
          thumbnail: thumbnail,
          personalInfo: personalInfo,
        },
        {
          onSuccess: () => {
            toast.success("Personal Info updated successfully");
            handleNext();
          },
          onError: () => {
            toast.success("Failed to update Personal Info");
          },
        }
      );
    },
    [resumeInfo, personalInfo]
  );

  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Personal Information</h2>
        <p className="text-sm">Get Started with the personal information</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div
            className="grid grid-cols-2 
        mt-5 gap-3"
          >
            <div>
              <Label className="text-sm">First Name</Label>
              <Input
                name="firstName"
                required
                autoComplete="off"
                placeholder=""
                value={personalInfo?.firstName || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-sm">Last Name</Label>
              <Input
                name="lastName"
                required
                autoComplete="off"
                placeholder=""
                value={personalInfo?.lastName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-sm">Job Title</Label>
              <Input
                name="jobTitle"
                required
                autoComplete="off"
                placeholder=""
                value={personalInfo?.jobTitle || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-sm">Address</Label>
              <Input
                name="address"
                required
                autoComplete="off"
                placeholder=""
                value={personalInfo?.address || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-sm">Phone number</Label>
              <Input
                name="phone"
                required
                autoComplete="off"
                placeholder=""
                value={personalInfo?.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-sm">Email</Label>
              <Input
                name="email"
                required
                autoComplete="off"
                placeholder=""
                value={personalInfo?.email || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button
            className="mt-4"
            type="submit"
            disabled={
              isPending || resumeInfo?.status === "archived" ? true : false
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

export default PersonalInfoForm;
