import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  setBasicDetails,
  setStep,
  setTestId,
} from "../../store/slice/createTest.slice";
import {
  createTest,
  getAllSubjects,
  getTopicsBySubject,
  getSubTopicsByTopic,
} from "../../api/test.api";

export default function Step1Basic() {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch } = useForm();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [subTopics, setSubTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedSubject = watch("subject");
  const selectedTopic = watch("topic");

  /* ======================
     FETCH SUBJECTS
  ====================== */
  useEffect(() => {
    getAllSubjects()
      .then(res => setSubjects(res.data.data || []))
      .catch(err => console.error("Subjects error", err));
  }, []);

  /* ======================
     FETCH TOPICS
  ====================== */
  useEffect(() => {
    if (!selectedSubject) return;

    getTopicsBySubject(selectedSubject)
      .then(res => setTopics(res.data.data || []))
      .catch(err => console.error("Topics error", err));
  }, [selectedSubject]);

  /* ======================
     FETCH SUB-TOPICS
  ====================== */
  useEffect(() => {
    if (!selectedTopic) return;

    getSubTopicsByTopic(selectedTopic)
      .then(res => setSubTopics(res.data.data || []))
      .catch(err => console.error("Sub-topics error", err));
  }, [selectedTopic]);

  /* ======================
     SUBMIT
  ====================== */
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const payload = {
        name: data.name,
        subject: data.subject,
        topics: [data.topic],
        sub_topics: data.subTopic ? [data.subTopic] : [],
        difficulty: data.difficulty,
        correct_marks: Number(data.correct),
        wrong_marks: Number(data.wrong),
        unattempt_marks: Number(data.unattempt),
        total_time: Number(data.duration),
        status: "draft",
        type: "chapterwise",
      };

      const res = await createTest(payload);

      dispatch(setTestId(res.data.data.id));
      dispatch(setBasicDetails(payload));
      dispatch(setStep(2));
    } catch (err) {
      console.error("Create test failed", err);
      alert("Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border rounded-xl p-6 max-w-6xl"
    >
      {/* -------- Tabs -------- */}
      <div className="flex gap-2 mb-6">
        {["Chapter Wise", "PYQ", "Mock Test", "Daily Challenge", "Uncategorized"].map(
          (tab, i) => (
            <button
              key={tab}
              type="button"
              className={`px-4 py-1.5 rounded-full text-sm border ${
                i === 0
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* -------- Form Grid -------- */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        {/* Subject */}
        <div>
          <label className="text-sm font-medium">Subject</label>
          <select
            {...register("subject")}
            className="mt-1 w-full h-[40px] border rounded-md px-3 text-sm"
          >
            <option value="">Choose from Drop-down</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium">Name of Test</label>
          <input
            {...register("name")}
            placeholder="Enter name of Test"
            className="mt-1 w-full h-[40px] border rounded-md px-3 text-sm"
          />
        </div>

        {/* Topic */}
        <div>
          <label className="text-sm font-medium">Topic</label>
          <select
            {...register("topic")}
            className="mt-1 w-full h-[40px] border rounded-md px-3 text-sm"
            disabled={!topics.length}
          >
            <option value="">Choose from Drop-down</option>
            {topics.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Topic */}
        <div>
          <label className="text-sm font-medium">Sub Topic</label>
          <select
            {...register("subTopic")}
            className="mt-1 w-full h-[40px] border rounded-md px-3 text-sm"
            disabled={!subTopics.length}
          >
            <option value="">Choose from Drop-down</option>
            {subTopics.map(st => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="text-sm font-medium">Duration (Minutes)</label>
          <input
            {...register("duration")}
            placeholder="Enter the time"
            className="mt-1 w-full h-[40px] border rounded-md px-3 text-sm"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-sm font-medium block mb-2">
            Test Difficulty Level
          </label>
          <div className="flex gap-6 mt-1">
            {["easy", "medium", "difficult"].map(level => (
              <label key={level} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  value={level}
                  {...register("difficulty")}
                />
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* -------- Marking Scheme -------- */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Marking Scheme</h3>

        <div className="grid grid-cols-5 gap-4">
          <input {...register("wrong")} defaultValue="-1" />
          <input {...register("unattempt")} defaultValue="0" />
          <input {...register("correct")} defaultValue="5" />
          <input disabled placeholder="Ex: 50" />
          <input disabled placeholder="Ex: 250 Marks" />
        </div>
      </div>

      {/* -------- Footer -------- */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Next"}
        </button>
      </div>
    </form>
  );
}
