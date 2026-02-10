import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../store/slice/createTest.slice";
import { getTestById } from "../../api/test.api";

/* ======================
   TYPES
====================== */

interface Question {
  id: string;
}

interface TestData {
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  questions?: Question[];
}

interface BasicDetails {
  type?: string;
  difficulty?: string;
}

interface RootState {
  createTest: {
    testId: string;
    noOfQuestions: number;
    basicDetails: BasicDetails;
  };
}

export default function Step3Confirm() {
  const dispatch = useDispatch();

  const testId = useSelector((s: RootState) => s.createTest.testId);
  const totalQuestions = useSelector(
    (s: RootState) => s.createTest.noOfQuestions
  );
  const basicDetails = useSelector(
    (s: RootState) => s.createTest.basicDetails
  );

  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* ======================
     FETCH TEST DETAILS
  ====================== */
  useEffect(() => {
    if (!testId) return;

    getTestById(testId)
      .then(res => setTestData(res.data.data as TestData))
      .finally(() => setLoading(false));
  }, [testId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border">
        Loading test details...
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-6 max-w-7xl">
      {/* -------- HEADER -------- */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Test created
          <span className="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full">
            All Questions Done
          </span>
        </h2>
      </div>

      <div className="flex gap-6">
        {/* -------- LEFT QUESTION LIST -------- */}
        <aside className="w-[220px] border rounded-lg p-3 space-y-2">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded-md text-sm ${
                i === 0
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "border text-gray-500"
              }`}
            >
              Question {i + 1}
            </div>
          ))}
        </aside>

        {/* -------- MAIN CONTENT -------- */}
        <div className="flex-1">
          {/* Test Meta */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs">
                {basicDetails?.type || "Chapter Wise"}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs">
                {basicDetails?.difficulty || "Easy"}
              </span>
            </div>

            <div className="text-sm text-gray-600 flex gap-6">
              <span>Subject: {testData?.subject || "-"}</span>
              <span>
                Topic: {testData?.topics?.join(", ") || "-"}
              </span>
              <span>
                Sub Topic: {testData?.sub_topics?.join(", ") || "-"}
              </span>
            </div>
          </div>

          {/* Publish Tabs */}
          <div className="flex gap-4 border-b mb-4">
            <button className="pb-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
              Publish Now
            </button>
            <button className="pb-2 text-sm text-gray-500">
              Schedule Publish
            </button>
            <button className="pb-2 text-sm text-gray-500">
              Save to Question Bank
            </button>
          </div>

          {/* Live Until */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Live Until</h3>

            <p className="text-xs text-gray-500 mb-3">
              Choose how long this test should remain available on the platform.
            </p>

            <div className="grid grid-cols-3 gap-y-3 text-sm">
              {[
                "Always Available",
                "1 Week",
                "2 Weeks",
                "3 Weeks",
                "1 Month",
                "Custom Duration",
              ].map((label, i) => (
                <label key={label} className="flex items-center gap-2">
                  <input type="radio" name="liveUntil" defaultChecked={i === 0} />
                  {label}
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                disabled
                placeholder="Select End Date"
                className="h-[38px] border rounded-md px-3 text-sm bg-gray-50"
              />
              <input
                disabled
                placeholder="Select End Time"
                className="h-[38px] border rounded-md px-3 text-sm bg-gray-50"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => dispatch(setStep(2))}
              className="px-6 py-2 text-sm border rounded-md text-gray-600"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => dispatch(setStep(4))}
              className="px-6 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
