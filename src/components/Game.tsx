import { Game as GameModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AddEditQuizDialog from "./AddEditQuizDialog";
import { Button, buttonVariants } from "./ui/button";
import { BarChart, Edit } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

interface GameProps {
  game: GameModel;
}

async function Game({ game }: GameProps) {
  const { userId } = auth();
  if (!userId) throw new Error("userId undefined");
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

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const quizAttemptedByUser = await clerkClient.users.getUser(game.userId);
  const quizAttemptedByUserEmail =
    quizAttemptedByUser.emailAddresses[0]?.emailAddress || "Email not found";
  const quizMadeByUser = await clerkClient.users.getUser(quiz.userId);
  const quizMadeByUserEmail =
    quizMadeByUser.emailAddresses[0]?.emailAddress || "Email not found";

  return (
    <>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-3">
              {quiz.name}
              <div className="flex flex-col gap-2">
                <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                  <span className="font-bold">QB: </span>
                  {quiz.questionBank.topic}
                </div>
                <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                  <span className="font-bold">Total Questions: </span>
                  {quiz.questions.length}
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <span>
              <span className="font-bold">Start Time: </span>
              {game.timeStarted.toLocaleString()}
            </span>
            <span>
              <span className="font-bold">End Time: </span>
              {game.timeEnded?.toLocaleString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Subtopics:
            </span>
            <div className="flex flex-wrap gap-2">
              {quiz.questions
                .map((question) => question.subtopic)
                .filter(
                  (subtopic, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => t.id === subtopic.id && t.name === subtopic.name,
                    ),
                )
                .map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className="rounded-md bg-blue-500 p-2 text-[13px] font-medium text-white"
                  >
                    {subtopic.name}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Quiz Attempted By:
            </span>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-md bg-blue-500 px-2 py-1 text-[13px] font-medium text-white">
                {quizAttemptedByUserEmail} {userId === game.userId && "(You)"}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Quiz Made By:
            </span>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-md bg-blue-500 px-2 py-1 text-[13px] font-medium text-white">
                {quizMadeByUserEmail} {userId === quiz.userId && "(You)"}
              </div>
            </div>
          </div>
          {/* access protection */}
          {userId === quiz.userId && (
            <Link
              href={`/games/${game.id}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-2 w-full text-center",
              )}
            >
              View Statistics
              <BarChart className="ml-2 h-4 w-4" />
            </Link>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default Game;
