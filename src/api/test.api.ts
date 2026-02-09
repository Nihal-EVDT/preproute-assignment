import api from "./axios";

// Get all tests
export const getAllTests = () => {
  return api.get("/tests");
};

// Get test by ID
export const getTestById = (testId: string) => {
  return api.get(`/tests/${testId}`);
};


// Create new test (Step 1)
export const createTest = (payload: {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics?: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_time?: number;
  status?: string | null;
}) => {
  return api.post("/tests", payload);
};

// Update test (attach questions / update totals etc.)
export const updateTest = (
  testId: string,
  payload: {
    name?: string;
    questions?: string[];
    total_questions?: number;
    total_marks?: number;
    status?: string;
  }
) => {
  return api.put(`/tests/${testId}`, payload);
};

// Publish test (Step 4)
export const publishTest = (testId: string) => {
  return api.put(`/tests/${testId}`, {
    status: "live",
  });
};


// Get all subjects
export const getAllSubjects = () => {
  return api.get("/subjects");
};

// Get topics by subject
export const getTopicsBySubject = (subjectId: string) => {
  return api.get(`/topics/subject/${subjectId}`);
};

// Get sub-topics by topic
export const getSubTopicsByTopic = (topicId: string) => {
  return api.get(`/sub-topics/topic/${topicId}`);
};


// Bulk create questions (Step 2)
export const createQuestionsBulk = (payload: {
  questions: {
    type: string;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correct_option: string;
    explanation?: string;
    difficulty?: string;
    topic?: string;
    sub_topic?: string;
    media_url?: string;
    test_id: string;
  }[];
}) => {
  return api.post("/questions/bulk", payload);
};
