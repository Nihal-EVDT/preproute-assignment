import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetTest } from "../../store/slice/createTest.slice";

export default function Step4Publish() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const test = useSelector((s: any) => s.createTest.basicDetails);

  const confirmPublish = async () => {
    // 🔹 API later
    // await publishTest(testId);

    dispatch(resetTest());
    navigate("/dashboard");
  };

  return (
    <div className="bg-white border rounded-xl p-6 max-w-7xl">
      {/* -------- HEADER -------- */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Test created
          <span className="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full">
            All questions done
          </span>
        </h2>
      </div>

      <div className="flex gap-6">
        {/* -------- LEFT QUESTION LIST -------- */}
        <aside className="w-[220px] border rounded-lg p-3 space-y-2">
          {["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6"].map(
            (q, i) => (
              <div
                key={q}
                className={`px-3 py-2 rounded-md text-sm ${
                  i === 0
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "border text-gray-500"
                }`}
              >
                {q}
              </div>
            )
          )}
        </aside>

        {/* -------- MAIN CONTENT -------- */}
        <div className="flex-1">
          {/* Test Meta */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs">
                  Chapter Wise
                </span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs">
                  Easy
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>Subject: Maths</p>
                <p>
                  Topic:{" "}
                  <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs">
                    Grammar
                  </span>{" "}
                  <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs">
                    Writing
                  </span>
                </p>
                <p>
                  Sub Topic:{" "}
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                    Application
                  </span>
                </p>
              </div>
            </div>

            {/* Hide Toggle */}
            <div className="flex items-center gap-2 text-sm">
              <span>Hide from Moderator</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>

          {/* Publish Tabs */}
          <div className="flex gap-4 border-b mb-4">
            <button className="pb-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
              Schedule Publish
            </button>
            <button className="pb-2 text-sm text-gray-500">
              Publish Now
            </button>
            <button className="pb-2 text-sm text-gray-500">
              Save to Question Bank
            </button>
          </div>

          {/* Schedule Date & Time */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-500">
                Select Date and Time
              </label>
              <input
                placeholder="Select Date"
                className="mt-1 w-full h-[38px] border rounded-md px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">&nbsp;</label>
              <input
                placeholder="Select Time"
                className="mt-1 w-full h-[38px] border rounded-md px-3 text-sm"
              />
            </div>
          </div>

          {/* Live Until */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Live Until</h3>
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
                  <input type="radio" name="liveUntil" defaultChecked={i === 5} />
                  {label}
                </label>
              ))}
            </div>

            {/* Custom Duration */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                placeholder="Select End Date"
                className="h-[38px] border rounded-md px-3 text-sm"
              />
              <input
                placeholder="Select End Time"
                className="h-[38px] border rounded-md px-3 text-sm"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-sm border rounded-md text-gray-600"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmPublish}
              className="px-6 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
