import { createSlice } from "@reduxjs/toolkit";

interface CreateTestState {
  noOfQuestions?: number | null;
  testId: string | null;
  basicDetails: any;
  questions: any[];
  currentStep: number;
  subjectId?: string | null;
}

const initialState: CreateTestState = {
  testId: null,
  basicDetails: {},
  questions: [],
  currentStep: 1,
  noOfQuestions: null,
  subjectId: null
};

const createTestSlice = createSlice({
  name: "createTest",
  initialState,
  reducers: {
    setBasicDetails(state, action) {
      state.basicDetails = action.payload;
    },
    setTestId(state, action) {
      state.testId = action.payload;
    },
    addQuestion(state, action) {
      state.questions.push(action.payload);
    },
    setStep(state, action) {
      state.currentStep = action.payload;
    },
    setNoOfQuestions(state, action) {
      state.noOfQuestions = action.payload;
    },
    setSubjectId(state, action) {
      state.subjectId = action.payload;
    },
    resetTest() {
      return initialState;
    },
  },
});

export const {
  setBasicDetails,
  setTestId,
  addQuestion,
  setStep,
  resetTest,
  setNoOfQuestions,
  setSubjectId
} = createTestSlice.actions;

export default createTestSlice.reducer;
