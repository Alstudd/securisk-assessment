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
  subtopics: z
    .array(
      z.object({
        id: objectId,
        questions: z
          .array(
            z.object({
              quest: z
                .string()
                .min(1, { message: "Question text is required" }),
              options: z
                .array(
                  z.string().min(1, { message: "Option text is required" }),
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
