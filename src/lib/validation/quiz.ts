import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid ObjectId format" });

export const createQuizSchema = z.object({
  name: z.string().min(1, { message: "Quiz name is required" }),
  accessEmails: z
    .array(z.string().email({ message: "Invalid email format" }))
    .optional(),
  questionBankId: objectId,
  questionCount: z
    .number()
    .int()
    .positive({ message: "Question count must be a positive integer" }),
  timer: z
    .number()
    .int()
    .positive({ message: "Timer must be a positive integer" })
    .optional(),
  subtopics: z
    .array(
      z.object({
        id: objectId,
        questions: z
          .array(
            z.object({
              scenario: z
                .string()
                .min(1, { message: "Scenario text is required" }),
              quest: z
                .string()
                .min(1, { message: "Question text is required" }),
              options: z
                .array(
                  z.object({
                    name: z
                      .string()
                      .min(1, { message: "Option name is required" }),
                    score: z
                      .number()
                      .int()
                      .min(1, { message: "Score must be a positive integer" }),
                  }),
                )
                .min(2, { message: "At least two options are required" }),
            }),
          )
          .min(1, {
            message: "At least one question is required per subtopic",
          }),
      }),
    )
    .min(1, { message: "At least one subtopic is required" }),
});

export type CreateQuizSchema = z.infer<typeof createQuizSchema>;

export const updateQuizSchema = createQuizSchema.extend({
  id: objectId,
});

export const deleteQuizSchema = z.object({
  id: objectId,
});
