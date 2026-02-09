import * as yup from "yup";

export const createTestSchema = yup.object({
  name: yup.string().required("Test name is required"),
  subject: yup.string().required("Subject is required"),
  topic: yup.string().required("Topic is required"),
  difficulty: yup.string().required("Difficulty is required"),
});
