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
import { createClerkClient } from "@clerk/backend";

export const metadata: Metadata = {
  title: "Securisk Assessment - Assessments",
};

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const Quizzes = async () => {
  const { userId, user } = auth();
  if (!userId) throw Error("userId undefined");
  const currentUser = await clerkClient.users.getUser(userId);
  const currentUserIsAdmin =
    currentUser?.emailAddresses[0]?.emailAddress === "alstonsoares17@gmail.com";
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
    orderBy: { updatedAt: "desc" },
  });
  const userQuizzes: (QuizModel & {
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
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-2">
      {(currentUserIsAdmin
        ? allQuizzes.length > 0
        : userQuizzes.length > 0) && (
        <>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              Assessments (
              {currentUserIsAdmin ? allQuizzes.length : userQuizzes.length})
            </h1>
          </div>
          <hr className="border-gray-300" />
        </>
      )}
      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {currentUserIsAdmin
          ? allQuizzes.map((item) => <Quiz quiz={item} key={item.id} />)
          : userQuizzes.map((item) => <Quiz quiz={item} key={item.id} />)}
        {(currentUserIsAdmin
          ? allQuizzes.length === 0
          : userQuizzes.length === 0) && (
          <div className="col-span-full text-center">
            {currentUser?.emailAddresses[0]?.emailAddress ===
              "souzaagnel@gmail.com" || currentUserIsAdmin
              ? "No assessments found. Click on the 'Add Assessment' button to add an assessment."
              : "No assessments found. You do not have access to create assessments."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
