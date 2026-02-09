import { useSelector } from "react-redux";
import AdminLayout from "../../components/DashboardLayout";
import Step1Basic from "./Step1Basic";
import Step2Questions from "./Step2Questions";
import Step3Confirm from "./Step3Confirm";
import Step4Publish from "./Step4Publish";



export default function CreateTest() {
  const step = useSelector((state: any) => state.createTest.currentStep);

  return (
    <AdminLayout>
      {step === 1 && <Step1Basic />}
      {step === 2 && <Step2Questions />}
      {step === 3 && <Step3Confirm />}
      {step === 4 && <Step4Publish />}
    </AdminLayout>
  );
}
