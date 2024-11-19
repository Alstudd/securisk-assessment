import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

const MainScoreCard = ({ mainScore, totalQuestions }: any) => {
  return (
    <Card className="md:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Main Score</CardTitle>
        <Target />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">
          {mainScore} / {totalQuestions * 5} <span className="font-bold">({((mainScore * 100) / (totalQuestions * 5)).toFixed(2)}%)</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MainScoreCard;
