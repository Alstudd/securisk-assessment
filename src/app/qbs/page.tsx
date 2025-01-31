import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import QuestionBank from "@/components/QuestionBank";
import {
  QuestionBank as QuestionBankModel,
  Subtopic as SubtopicModel,
} from "@prisma/client";
import { createClerkClient } from "@clerk/backend";

export const metadata: Metadata = {
  title: "Securisk Assessment - Question Banks",
};

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const QuestionBanks = async () => {
  const { userId, user } = auth();
  if (!userId) throw Error("userId undefined");
  const currentUser = await clerkClient.users.getUser(userId);
  const currentUserIsAdmin =
    currentUser?.emailAddresses[0]?.emailAddress === "alstonsoares17@gmail.com";
  const allQuestionBanks: (QuestionBankModel & {
    subtopics: SubtopicModel[];
  })[] = await prisma.questionBank.findMany({
    include: { subtopics: true },
    orderBy: { updatedAt: "desc" },
  });
  const userQuestionBanks: (QuestionBankModel & {
    subtopics: SubtopicModel[];
  })[] = await prisma.questionBank.findMany({
    where: { userId },
    include: { subtopics: true },
    orderBy: { updatedAt: "desc" },
  });
  return (
    <div className="flex flex-col gap-2">
      {(currentUserIsAdmin
        ? allQuestionBanks.length > 0
        : userQuestionBanks.length > 0) && (
        <>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              QBs (
              {currentUserIsAdmin
                ? allQuestionBanks.length
                : userQuestionBanks.length}
              )
            </h1>
          </div>
          <hr className="border-gray-300" />
        </>
      )}
      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {currentUserIsAdmin
          ? allQuestionBanks.map((item) => (
              <QuestionBank questionBank={item} key={item.id} />
            ))
          : userQuestionBanks.map((item) => (
              <QuestionBank questionBank={item} key={item.id} />
            ))}
        {(currentUserIsAdmin
          ? allQuestionBanks.length === 0
          : userQuestionBanks.length === 0) && (
          <div className="col-span-full text-center">
            {currentUser?.emailAddresses[0]?.emailAddress ===
              "souzaagnel@gmail.com" || currentUserIsAdmin
              ? "No question banks found. Click on the 'Add QB' button to add a question bank."
              : "No question banks found. You do not have access to create question banks."}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBanks;
