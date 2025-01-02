import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/db/prisma";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";

import { redirect } from "next/navigation";
import React from "react";
import ResultsCard from "@/components/games/ResultsCard";
import QuizNameCard from "@/components/games/QuizNameCard";
import TimeTakenCard from "@/components/games/TimeTakenCard";
import QuestionsList from "@/components/games/QuestionsList";
import MainScoreCard from "@/components/games/MainScoreCard";
import TotalQuestionsCard from "@/components/games/TotalQuestionsCard";
import { auth } from "@clerk/nextjs";
import { createClerkClient } from "@clerk/backend";
import GradeList from "@/components/games/GradeList";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

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

  // access protection
  if (quiz?.userId !== userId) {
    return redirect("/reports");
  }

  const user = await clerkClient.users.getUser(game.userId);
  const userName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Name not found";

  return (
    <>
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/reports" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-0 sm:mr-2" />
              <span className="hidden sm:block">Your Reports</span>
            </Link>
          </div>
        </div>

        <ResultsCard
          userName={userName}
          mainScore={game.mainScore}
          totalQuestions={quiz?.questions.length}
        />
        <GradeList questions={quiz?.questions} answers={game.answers} />
        <div className="mt-4 grid gap-4 md:grid-cols-7">
          <QuizNameCard quizName={quiz?.name} />
          <TimeTakenCard
            timeEnded={game.timeEnded ? new Date(game.timeEnded) : undefined}
            timeStarted={new Date(game.timeStarted)}
          />
          <MainScoreCard
            mainScore={game.mainScore}
            totalQuestions={quiz?.questions.length}
          />
          <TotalQuestionsCard
            totalQuestions={quiz?.questions.length}
            questionsAttempted={game.answers.length}
          />
        </div>
        <QuestionsList questions={quiz?.questions} answers={game.answers} />
      </div>
    </>
  );
};

export default Statistics;
