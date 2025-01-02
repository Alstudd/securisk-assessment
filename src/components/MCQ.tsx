"use client";

import {
  BarChart,
  ChevronRight,
  Loader2,
  LucideLayoutDashboard,
  Timer,
} from "lucide-react";
import { differenceInSeconds } from "date-fns";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn, formatTimeDelta } from "@/lib/utils";
import Link from "next/link";

interface MCQProps {
  quiz: any;
  questions: any[];
  gameId: string;
}

export default function MCQ({ quiz, questions, gameId }: MCQProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [timeStarted, setTimeStarted] = useState<Date>(new Date());
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion?.options || [];

  useEffect(() => {
    setTimeStarted(new Date());
  }, []);

  const handleNext = async () => {
    if (selectedChoice === null) {
      console.warn("No choice selected. Please select an option.");
      return;
    }

    setIsLoading(true);

    const selectedOption = options[selectedChoice];
    const optionScore = selectedOption?.score ?? 0;

    // console.log("Current Question Index:", currentQuestionIndex);
    // console.log("Selected Option:", selectedOption);
    // console.log("Option Score:", optionScore);
    // console.log("Score Before Update:", score);

    const answer = {
      gameId,
      questionId: currentQuestion.id,
      selectedOption,
    };

    try {
      await fetch("/api/games/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answer),
      });

      setScore((prev) => {
        const updatedScore = prev + optionScore;
        // console.log("Score After Update:", updatedScore);
        return updatedScore;
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedChoice(null);
    } else {
      endGame(optionScore);
    }

    setIsLoading(false);
  };

  const endGame = async (lastOptionScore: number) => {
    const finalScore = score + lastOptionScore;
    const timeEnded = new Date();
    const gameData = {
      gameId,
      timeEnded,
      mainScore: finalScore,
    };

    console.log("Assessment End Data:", gameData);

    try {
      await fetch("/api/games/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameData),
      });

      setHasEnded(true);
      console.log("Assessment ended successfully!");
    } catch (error) {
      console.error("Error ending assessment:", error);
    }
  };

  if (hasEnded) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mt-2 w-fit whitespace-nowrap rounded-md bg-green-500 px-4 py-2 text-center font-semibold text-white">
          You Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, timeStarted))}
        </div>
        {/* Because of access protection */}
        {/* <Link
          href={`/games/${gameId}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-2 text-center w-fit")}
        >
          View Statistics
          <BarChart className="ml-2 h-4 w-4" />
        </Link> */}
        <Link
          href="/reports"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-2 w-fit text-center",
          )}
        >
          Your Reports
          <LucideLayoutDashboard className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400">
              Topic
              {/* {currentQuestion.scenario === "Untitled Scenario"
                ? "Topic"
                : "Scenario"} */}
            </span>{" "}
            &nbsp;
            <span className="rounded-lg bg-slate-800 px-2 py-1 text-white">
              {quiz.name}
              {/* {currentQuestion.scenario === "Untitled Scenario"
                ? quiz.name
                : currentQuestion.scenario} */}
            </span>
          </p>
        </div>
        <div className="mt-3 flex self-start text-slate-400">
          <Timer className="mr-2" />
          {formatTimeDelta(differenceInSeconds(now, timeStarted))}
        </div>
      </div>
      <Card className="mt-4 w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 divide-y divide-zinc-600/50 text-center">
            <div>{currentQuestionIndex + 1}</div>
            <div className="text-base text-slate-400">{questions.length}</div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.quest}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        {options.map((option: any, index: number) => (
          <Button
            key={index}
            variant={selectedChoice === index ? "default" : "outline"}
            className="mb-4 w-full justify-start py-8"
            onClick={() => setSelectedChoice(index)}
          >
            <div className="flex items-center justify-start">
              <div className="mr-5 rounded-md border p-2 px-3">{index + 1}</div>
              <div className="text-start">{option.name}</div>
            </div>
          </Button>
        ))}
        <Button
          variant="default"
          className="mt-2"
          size="lg"
          disabled={isLoading}
          onClick={handleNext}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
