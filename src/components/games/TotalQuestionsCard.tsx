import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCheck } from "lucide-react";

const TotalQuestionsCard = ({ totalQuestions, questionsAttempted }: any) => {
  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Total Questions</CardTitle>
        <BookCheck />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          Attempted {questionsAttempted} out of {totalQuestions} questions
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalQuestionsCard;
