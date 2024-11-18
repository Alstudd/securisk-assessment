import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/db/prisma";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";

import { redirect } from "next/navigation";
import React from "react";
import ResultsCard from "@/components/statistics/ResultsCard";
import QuizNameCard from "@/components/statistics/QuizNameCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import QuestionsList from "@/components/statistics/QuestionsList";
import { auth } from "@clerk/nextjs";

type Props = {
  params: {
    gameId: string;
  };
};

const Statistics = async ({ params: { gameId } }: Props) => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { answers: true },
  });
  if (!game) {
    return redirect("/");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: game.quizId },
    include: {
      questionBank: true,
      questions: {
        include: {
          subtopic: true,
        },
      },
    },
  });

  return (
    <>
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/games" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Go to Games
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-7">
          <ResultsCard
            mainScore={game.mainScore}
            totalQuestions={quiz?.questions.length}
          />
          <QuizNameCard quizName={quiz?.name} />
          <TimeTakenCard
            timeEnded={new Date(game.timeEnded ?? 0)}
            timeStarted={new Date(game.timeStarted ?? 0)}
          />
        </div>
        <QuestionsList questions={quiz?.questions} answers={game.answers} />
      </div>
    </>
  );
};

export default Statistics;
