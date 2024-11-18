import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import MCQ from "@/components/MCQ";
import StartQuiz from "@/components/StartQuiz";

export const metadata: Metadata = {
  title: "Transformatrix Quiz - Quizzes",
};

type Props = {
  params: {
    quizId: string;
  };
};

const Quizzes = async ({ params: { quizId } }: Props) => {
  const { userId } = auth();
  if (!userId) throw new Error("userId undefined");

  const quiz: any = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questionBank: true,
      questions: {
        include: {
          subtopic: true,
        },
      },
    },
  });

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const quizQuestions = quiz.questions;

  console.log(quiz);
  console.log(quizQuestions);

  return (
    <StartQuiz quiz={quiz} questions={quizQuestions} quizId={quizId} />
  );
};

export default Quizzes;
