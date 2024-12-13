import React from "react";
import grading from "@/assets/grading.json";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GradeList = ({ questions, answers }: any) => {
  const newQuestions = questions.map((item: any, index: any) => {
    const userAnswer = answers.find(
      (answer: any) => answer.questionId === questions[index].id,
    )?.selectedOption;
    return {
      name: item.subtopic.name,
      score: userAnswer?.score || 0,
    };
  });

  const result = Object.values(
    newQuestions.reduce((acc: any, curr: any) => {
      if (!acc[curr.name]) {
        acc[curr.name] = {
          name: curr.name,
          totalScore: 0,
          count: 0,
          percentage: 0,
          grade: "",
        };
      }
      acc[curr.name].totalScore += curr.score;
      acc[curr.name].count += 1;
      acc[curr.name].percentage =
        (acc[curr.name].totalScore * 100) / (acc[curr.name].count * 5);
      if (acc[curr.name].percentage >= 0 && acc[curr.name].percentage <= 20) {
        acc[curr.name].grade = "Poor";
      } else if (
        acc[curr.name].percentage > 20 &&
        acc[curr.name].percentage <= 40
      ) {
        acc[curr.name].grade = "Low";
      } else if (
        acc[curr.name].percentage > 40 &&
        acc[curr.name].percentage <= 60
      ) {
        acc[curr.name].grade = "Moderate";
      } else if (
        acc[curr.name].percentage > 60 &&
        acc[curr.name].percentage <= 80
      ) {
        acc[curr.name].grade = "Good";
      } else {
        acc[curr.name].grade = "Excellent";
      }
      return acc;
    }, {}),
  );

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Subtopic</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Grade Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((item: any, index: any) => {
          return (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item?.name}</TableCell>
              <TableCell className="font-semibold">
                {item?.totalScore} / {item?.count * 5} (
                {item?.percentage.toFixed(2)}%)
              </TableCell>
              <TableCell className="font-semibold">
                {item?.grade || "No grade provided"}
              </TableCell>
              <TableCell>
                {grading?.find(
                  (gradeItem: any) =>
                    gradeItem["Subtopic"] === item?.name &&
                    gradeItem["Grade"] === item?.grade,
                )?.["Grade Description"] || "No grade description provided"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default GradeList;
