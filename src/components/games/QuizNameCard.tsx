import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const QuizNameCard = ({ quizName }: any) => {
  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Assessment Name</CardTitle>
        <Brain />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{quizName}</div>
      </CardContent>
    </Card>
  );
};

export default QuizNameCard;
