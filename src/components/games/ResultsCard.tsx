import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";

const ResultsCard = ({ mainScore, totalQuestions }: any) => {
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="flex h-3/5 flex-col items-center justify-center">
        {mainScore / totalQuestions >= 4 ? (
          <>
            <Trophy className="mr-4" stroke="gold" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-400">
              <span className="text-center">Impressive!</span>
              <span className="text-center text-sm dark:text-white text-black opacity-50">
                You attempted {totalQuestions} questions
              </span>
            </div>
          </>
        ) : mainScore / totalQuestions >= 3 ? (
          <>
            <Trophy className="mr-4" stroke="silver" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-stone-400">
              <span className="text-center">Good job!</span>
              <span className="text-center text-sm dark:text-white text-black opacity-50">
                You attempted {totalQuestions} questions
              </span>
            </div>
          </>
        ) : (
          <>
            <Trophy className="mr-4" stroke="brown" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-800">
              <span className="text-center">Nice try!</span>
              <span className="text-center text-sm dark:text-white text-black opacity-50">
                You attempted {totalQuestions} questions
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
