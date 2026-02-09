import { createSlice } from "@reduxjs/toolkit";

interface CreateTestState {
  testId: string | null;
  basicDetails: any;
  questions: any[];
  currentStep: number;
}

const initialState: CreateTestState = {
  testId: null,
  basicDetails: {},
  questions: [],
  currentStep: 1,
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
} = createTestSlice.actions;

export default createTestSlice.reducer;
