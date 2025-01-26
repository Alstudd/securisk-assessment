"use client";

import {
  Quiz as QuizModel,
  QuizQuestion,
  Subtopic as SubtopicModel,
} from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AddEditQuizDialog from "./AddEditQuizDialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";

interface QuizProps {
  quiz: QuizModel & {
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
  };
}

export default function Quiz({ quiz }: QuizProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const wasUpdated = quiz.updatedAt > quiz.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? quiz.updatedAt : quiz.createdAt
  ).toDateString();

  return (
    <>
      {/* <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-3">
              {quiz.name}
              <div className="flex flex-col gap-2">
                <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                  <span className="font-bold">QB: </span>
                  {quiz.questionBank.topic}
                </div>
                <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                  <span className="font-bold">Questions: </span>
                  {quiz.questionCount}
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">
              Subtopics:
            </span>
            <div className="flex flex-wrap gap-2">
              {quiz.questions
                .map((question) => question.subtopic)
                .filter(
                  (subtopic, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => t.id === subtopic.id && t.name === subtopic.name,
                    ),
                )
                .map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className="rounded-md bg-blue-500 p-2 text-[13px] font-medium text-white"
                  >
                    {subtopic.name}
                  </div>
                ))}
            </div>
          </div>
          {quiz.accessEmails.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500">
                Access Emails:
              </span>
              <div className="flex flex-wrap gap-2">
                {quiz.accessEmails.map((accessEmail, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-blue-500 px-2 py-1 text-[13px] font-medium text-white"
                  >
                    {accessEmail}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <div className="mt-auto p-4">
          <Button className="w-full" onClick={() => setShowEditDialog(true)}>
            <Edit size={20} className="mr-2" />
            Update Assessment
          </Button>
        </div>
      </Card> */}

      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-3">
              {quiz.name}
              <div className="flex flex-col gap-2">
                <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                  <span className="font-bold">QB: </span>
                  {quiz.questionBank.topic}
                </div>
                {quiz.timer && (
                  <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                    <span className="font-bold">Timer : </span>
                    {quiz.timer}
                  </div>
                )}
                <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                  <span className="font-bold">Question Count: </span>
                  {quiz.questionCount}
                </div>
                <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                  <span className="font-bold">Total Questions: </span>
                  {quiz.questions.length}
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Subtopics:
            </span>
            <div className="flex flex-wrap gap-2">
              {quiz.questions
                .map((question) => question.subtopic)
                .filter(
                  (subtopic, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => t.id === subtopic.id && t.name === subtopic.name,
                    ),
                )
                .map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className="rounded-md bg-blue-500 p-2 text-[13px] font-medium text-white"
                  >
                    {subtopic.name}
                  </div>
                ))}
            </div>
          </div>
          {quiz.accessEmails.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Access Emails:
              </span>
              <div className="flex flex-wrap gap-2">
                {quiz.accessEmails.map((accessEmail, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-blue-500 px-2 py-1 text-[13px] font-medium text-white"
                  >
                    {accessEmail}
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button className="mt-2" onClick={() => setShowEditDialog(true)}>
            <Edit size={20} className="mr-2" />
            Update Assessment
          </Button>
        </CardContent>
      </Card>
      <AddEditQuizDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        quizToEdit={quiz}
      />
    </>
  );
}
