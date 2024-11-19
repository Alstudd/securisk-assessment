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
  return (
    <Table className="mt-4">
      <TableCaption>End of list.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Answer</TableHead>
          <TableHead>Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map(({ quest }: any, index: any) => {
          const userAnswer = answers.find(
            (answer: any) => answer.questionId === questions[index].id,
          )?.selectedOption;

          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{quest}</TableCell>
              <TableCell className="font-semibold">
                {userAnswer?.name || "No answer provided"}
              </TableCell>
              <TableCell className="font-semibold">
                {userAnswer?.score || "No score provided"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default QuestionsList;
