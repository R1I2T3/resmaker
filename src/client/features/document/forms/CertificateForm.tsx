import { useResumeContext } from "@/client/providers/resume-info-provider";
import { useState, useEffect } from "react";
import useUpdateDocument from "../../resumes/hooks/use-update-document";
import { Button } from "@/client/components/ui/button";
import { X, Plus, Loader } from "lucide-react";
import { Label } from "@/client/components/ui/label";
import { Input } from "@/client/components/ui/input";
import { generateThumbnail } from "@/client/helper";

const initialState = {
  id: "",
  docId: "",
  title: "",
  description: "",
  date: "",
};
const CertificateForm = () => {
  const { resumeInfo, onUpdate } = useResumeContext();
  const { mutateAsync, isPending } = useUpdateDocument();
  const [certificateList, setCertificateList] = useState([
    ...(resumeInfo?.certificates || []),
    initialState,
  ]);
  useEffect(() => {
    if (!resumeInfo) {
      return;
    }
    onUpdate({
      ...resumeInfo,
      certificates: certificateList,
    });
  }, [certificateList]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const thumbnail = await generateThumbnail();
    console.log(certificateList);
    await mutateAsync({
      ...Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(resumeInfo || {}).filter(([_, v]) => v !== null)
      ),
      certificates: certificateList,
      thumbnail: thumbnail || undefined,
    });
  };
  const removeCertificate = (index: number) => {
    const updatedCertificate = [...certificateList];
    updatedCertificate.splice(index, 1);
    setCertificateList(updatedCertificate);
  };
  const handleChange = (
    e: { target: { name: string; value: string } },
    index: number
  ) => {
    const { name, value } = e.target;
    setCertificateList((prevState) => {
      const newCertificateList = [...prevState];
      newCertificateList[index] = {
        ...newCertificateList[index],
        [name]: value,
      };
      return newCertificateList;
    });
  };
  const addNewCertificate = () => {
    setCertificateList([...certificateList, initialState]);
  };
  return (
    <div>
      <div className="w-full">
        <h2 className="font-bold text-lg">Certificates & Achievements</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border w-full h-auto divide-y-[1px] rounded-md px-3 pb-4 my-5">
          {certificateList.map((certificate, index) => (
            <div key={index}>
              <div className="relative grid grid-cols-2 mb-5 pt-4 gap-3">
                {certificateList?.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    className="size-[20px] text-center rounded-full absolute -top-3 -right-5 !bg-black dark:!bg-gray-600 text-white"
                    size="icon"
                    disabled={isPending}
                    onClick={() => removeCertificate(index)}
                  >
                    <X size="13px" />
                  </Button>
                )}
                <div className="col-span-2">
                  <Label className="text-sm">Title</Label>
                  <Input
                    name="title"
                    placeholder=""
                    required
                    value={certificate.title || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-sm">Description</Label>
                  <Input
                    name="description"
                    placeholder=""
                    required
                    value={certificate.description || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Date</Label>
                  <Input
                    name="date"
                    type="date"
                    placeholder=""
                    required
                    value={certificate.date || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
              </div>
              {index === certificateList.length - 1 &&
                certificateList.length < 5 && (
                  <Button
                    className="gap-1 mt-1 text-primary 
                          border-primary/50"
                    variant="outline"
                    type="button"
                    onClick={addNewCertificate}
                  >
                    <Plus size="15px" />
                    Add More Certificate
                  </Button>
                )}
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

export default CertificateForm;
