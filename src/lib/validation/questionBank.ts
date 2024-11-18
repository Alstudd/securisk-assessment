import { z } from "zod";

export const optionSchema = z.object({
  name: z.string().min(1, { message: "Option name is required" }),
  score: z
    .number()
    .int()
    .min(1, { message: "Score must be a positive integer" }),
});

export const questionSetSchema = z.object({
  quest: z.string().min(1, { message: "Question is required" }),
  options: z
    .array(optionSchema)
    .min(2, { message: "At least two options are required" }),
});

export const subtopicSchema = z.object({
  name: z.string().min(1, { message: "Subtopic name is required" }),
  questionSets: z
    .array(questionSetSchema)
    .min(1, { message: "At least one question set is required" }),
});

export const createQuestionBankSchema = z.object({
  topic: z.string().min(1, { message: "Topic is required" }),
  subtopics: z
    .array(subtopicSchema)
    .min(1, { message: "At least one subtopic is required" }),
});

export type CreateQuestionBankSchema = z.infer<typeof createQuestionBankSchema>;

export const updateQuestionBankSchema = createQuestionBankSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});

export const updateQuestionBankTopicSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  topic: z.string().min(1, { message: "Topic is required" }),
});

export const deleteQuestionBankSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
});
