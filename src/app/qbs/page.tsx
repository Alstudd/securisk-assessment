import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import QuestionBank from "@/components/QuestionBank";
import {
  QuestionBank as QuestionBankModel,
  Subtopic as SubtopicModel,
} from "@prisma/client";

export const metadata: Metadata = {
  title: "Transformatrix Quiz - Question Banks",
};

const QuestionBanks = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allQuestionBanks: (QuestionBankModel & {
    subtopics: SubtopicModel[];
  })[] = await prisma.questionBank.findMany({
    where: { userId },
    include: { subtopics: true },
  });
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allQuestionBanks.map((item) => (
        <QuestionBank questionBank={item} key={item.id} />
      ))}
      {allQuestionBanks.length === 0 && (
        <div className="col-span-full text-center">
          {
            'No question banks found. Click on the "Add QB" button to add a question bank.'
          }
        </div>
      )}
    </div>
  );
};

export default QuestionBanks;
