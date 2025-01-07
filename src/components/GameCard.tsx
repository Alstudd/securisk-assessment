"use client";

import { Game, Quiz } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import LoadingButton from "./ui/loading-button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { BarChart, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface GameCardProps {
  userId: string;
  quiz: any;
  game: Game;
  quizAttemptedByUserEmail: string;
  quizMadeByUserEmail: string;
}

export function GameCard({
  userId,
  quiz,
  game,
  quizAttemptedByUserEmail,
  quizMadeByUserEmail,
}: GameCardProps) {
  const router = useRouter();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const deleteGame = async () => {
    // first confirm then delete
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      setDeleteInProgress(true);
      const response = await fetch("/api/games", {
        method: "DELETE",
        body: JSON.stringify({ id: game.id }),
      });
      if (!response.ok)
        throw new Error(`Request failed with status: ${response.status}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error deleting report. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  };
  return (
    <Card className="relative transition-shadow hover:shadow-lg">
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
                <span className="font-bold">Question Count: </span>
                {quiz.questionCount}
              </div>
              <div className="w-fit rounded-md bg-black p-2 text-[14px] font-medium text-white dark:bg-white dark:text-black">
                <span className="font-bold">Total Questions: </span>
                {quiz.questions.length}
              </div>
            </div>
          </div>
          {userId === quiz.userId && (
            <div className="absolute right-6 top-4">
              <LoadingButton
                variant="destructive"
                loading={deleteInProgress}
                disabled={deleteInProgress}
                onClick={deleteGame}
                type="button"
              >
                <Trash className="h-5 w-5" />
              </LoadingButton>
            </div>
          )}
        </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <span>
            <span className="font-bold">Start Time: </span>
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }).format(new Date(game.timeStarted))}
          </span>
          <span>
            <span className="font-bold">End Time: </span>
            {game.timeEnded
              ? new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                }).format(new Date(game.timeEnded))
              : "N/A"}
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
              .map((question: any) => question.subtopic)
              .filter(
                (subtopic: any, index: any, self: any) =>
                  index ===
                  self.findIndex(
                    (t: any) =>
                      t.id === subtopic.id && t.name === subtopic.name,
                  ),
              )
              .map((subtopic: any) => (
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
            Assessment Attempted By:
          </span>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-md bg-blue-500 px-2 py-1 text-[13px] font-medium text-white">
              {quizAttemptedByUserEmail} {userId === game.userId && "(You)"}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Assessment Made By:
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
            href={`/reports/${game.id}`}
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
  );
}
