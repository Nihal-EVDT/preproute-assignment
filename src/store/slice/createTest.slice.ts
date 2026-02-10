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

interface CreateTestState {
  noOfQuestions: number | null;
  testId: string | null;
  basicDetails: BasicDetails;
  questions: Question[];
  currentStep: number;
  subjectId: string | null;
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
} = createTestSlice.actions;

export default createTestSlice.reducer;
