import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";

const ResultsCard = ({ userName, mainScore, totalQuestions }: any) => {
  const score = (mainScore * 100) / (totalQuestions * 5);
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="flex h-3/5 flex-col items-center justify-center">
        {score >= 0 && score <= 20 ? (
          <>
            <Trophy className="mr-2" stroke="red" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-red-600">
              <span className="text-center">Poor!</span>
              <span className="text-center text-sm text-black opacity-50 dark:text-white">
                <span className="font-bold opacity-100">{userName}</span> got{" "}
                {score.toFixed(2)} %
              </span>
            </div>
          </>
        ) : score > 20 && score <= 40 ? (
          <>
            <Trophy className="mr-2" stroke="tomato" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-red-400">
              <span className="text-center">Low!</span>
              <span className="text-center text-sm text-black opacity-50 dark:text-white">
                <span className="font-bold opacity-100">{userName}</span> got{" "}
                {score.toFixed(2)} %
              </span>
            </div>
          </>
        ) : score > 40 && score <= 60 ? (
          <>
            <Trophy className="mr-2" stroke="brown" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-800">
              <span className="text-center">Moderate!</span>
              <span className="text-center text-sm text-black opacity-50 dark:text-white">
                <span className="font-bold opacity-100">{userName}</span> got{" "}
                {score.toFixed(2)} %
              </span>
            </div>
          </>
        ) : score > 60 && score <= 80 ? (
          <>
            <Trophy className="mr-2" stroke="silver" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-stone-400">
              <span className="text-center">Good!</span>
              <span className="text-center text-sm text-black opacity-50 dark:text-white">
                <span className="font-bold opacity-100">{userName}</span> got{" "}
                {score.toFixed(2)} %
              </span>
            </div>
          </>
        ) : (
          <>
            <Trophy className="mr-2" stroke="gold" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-400">
              <span className="text-center">Excellent!</span>
              <span className="text-center text-sm text-black opacity-50 dark:text-white">
                <span className="font-bold opacity-100">{userName}</span> got{" "}
                {score.toFixed(2)} %
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
