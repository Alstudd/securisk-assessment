import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import Quiz from "@/components/Quiz";
import {
  Quiz as QuizModel,
  QuizQuestion,
  Subtopic as SubtopicModel,
} from "@prisma/client";

export const metadata: Metadata = {
  title: "Transformatrix Quiz - Quizzes",
};

const Quizzes = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allQuizzes: (QuizModel & {
    questionBank: {
      topic: string;
      subtopics: SubtopicModel[];
    };
    questions: (QuizQuestion & {
      subtopic: {
        id: string;
        name: string;
        questionBankId: string;
      };
    })[];
  })[] = await prisma.quiz.findMany({
    where: { userId },
    include: {
      questionBank: {
        select: {
          topic: true,
          subtopics: {
            select: {
              id: true,
              name: true,
              questionBankId: true,
            },
          },
        },
      },
      questions: {
        include: {
          subtopic: true,
        },
      },
    },
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allQuizzes.map((item) => (
        <Quiz quiz={item} key={item.id} />
      ))}
      {allQuizzes.length === 0 && (
        <div className="col-span-full text-center">
          {"No quizzes found. Click on the 'Add Quiz' button to add a quiz."}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
