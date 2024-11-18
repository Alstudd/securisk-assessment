import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";

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

  const quiz = await prisma.quiz.findUnique({
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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* {quizQuestions.length > 0 ? (
        quizQuestions.map((question) => (
          <Quiz quiz={question} key={question.id} />
        ))
      ) : (
        <div className="col-span-full text-center">
          {"No questions found for this quiz."}
        </div>
      )} */}
    </div>
  );
};

export default Quizzes;
