"use client";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const QuestionsList = ({ questions, answers }: any) => {
  const attemptedQuestionIds = answers.map((answer: any) => answer.questionId);
  const unattemptedQuestions = questions.filter(
    (question: any) => !attemptedQuestionIds.includes(question.id),
  );

  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Subtopic</TableHead>
          <TableHead>Scenario</TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Answer</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Time taken</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {answers.map((answer: any, index: any) => {
          const question = questions.find(
            (q: any) => q.id === answer.questionId,
          );

          if (!question) return null;

          return (
            <TableRow key={`answered-${index}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{question.subtopic.name}</TableCell>
              <TableCell>{question.scenario}</TableCell>
              <TableCell>{question.quest}</TableCell>
              <TableCell className="font-semibold">
                {answer.selectedOption?.name || "No answer provided"}
              </TableCell>
              <TableCell className="font-semibold">
                {answer.selectedOption?.score || "No points provided"}
              </TableCell>
              <TableCell className="font-semibold">
                {answer.timeTookToAnswer === 0
                  ? "0s"
                  : answer.timeTookToAnswer
                    ? `${answer.timeTookToAnswer}s`
                    : "No time provided"}
              </TableCell>
            </TableRow>
          );
        })}

        {unattemptedQuestions.map((question: any, index: any) => (
          <TableRow key={`unattempted-${index}`}>
            <TableCell>{answers.length + index + 1}</TableCell>
            <TableCell>{question.subtopic.name}</TableCell>
            <TableCell>{question.scenario}</TableCell>
            <TableCell>{question.quest}</TableCell>
            <TableCell className="font-semibold text-gray-500">
              Not attempted
            </TableCell>
            <TableCell className="font-semibold text-gray-500">-</TableCell>
            <TableCell className="font-semibold text-gray-500">-</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionsList;
