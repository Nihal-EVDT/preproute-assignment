import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/* ======================
   TYPES
====================== */

export interface BasicDetails {
  type?: string;
  difficulty?: string;
  subject?: string;
}

export interface Question {
  type: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
  difficulty?: string;
  subject: string;
  test_id: string;
}

export type TestType = "chapterwise" | "fulltest" | "mock";
export type TestDifficulty = "easy" | "medium" | "hard";
export type TestStatus = "draft" | "live" | "expired";

export interface TestDetails {
  id: string;
  name: string;

  type: TestType;
  difficulty: TestDifficulty;
  status: TestStatus;

  subject: string;
  topics: string[];
  sub_topics: string[];

  questions: string[]; // question IDs

  total_questions: number;
  total_marks: number;
  total_time: number;

  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;

  paragraph_question: string | null;

  scheduled_date: string | null;
  expiry_date: string | null;
  slot: string | null;

  hidden_from_moderator: boolean | null;

  created_at: string;
  created_by: number;

  updated_at: string;
  updated_by: number;
}


interface CreateTestState {
  noOfQuestions: number | null;
  testId: string | null;
  basicDetails: BasicDetails;
  questions: Question[];
  currentStep: number;
  subjectId: string | null;
  getById: TestDetails | null;
}

/* ======================
   INITIAL STATE
====================== */

const initialState: CreateTestState = {
  testId: null,
  basicDetails: {},
  questions: [],
  currentStep: 1,
  noOfQuestions: null,
  subjectId: null,
  getById:null,
};

/* ======================
   SLICE
====================== */

const createTestSlice = createSlice({
  name: "createTest",
  initialState,
  reducers: {
    setBasicDetails(state, action: PayloadAction<BasicDetails>) {
      state.basicDetails = action.payload;
    },

    setTestId(state, action: PayloadAction<string | null>) {
      state.testId = action.payload;
    },

    addQuestion(state, action: PayloadAction<Question>) {
      state.questions.push(action.payload);
    },

    setStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },

    setNoOfQuestions(state, action: PayloadAction<number | null>) {
      state.noOfQuestions = action.payload;
    },

    setSubjectId(state, action: PayloadAction<string | null>) {
      state.subjectId = action.payload;
    },
    setGetById(state, action: PayloadAction<TestDetails | null>) {
      state.getById = action.payload;
    },

    resetTest() {
      return initialState;
    },
  },
});

/* ======================
   EXPORTS
====================== */

export const {
  setBasicDetails,
  setTestId,
  addQuestion,
  setStep,
  resetTest,
  setNoOfQuestions,
  setSubjectId,
  setGetById,
} = createTestSlice.actions;

export default createTestSlice.reducer;
