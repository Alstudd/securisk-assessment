"use client";

import { useState, useEffect } from "react";
import MCQ from "./MCQ";
import { Button } from "./ui/button";
import { Book, Brain, Loader2 } from "lucide-react";
import { shuffle } from "@/lib/utils";

interface MCQProps {
  quiz: any;
  questions: any[];
  quizId: string;
}

export default function StartQuiz({ quiz, questions, quizId }: MCQProps) {
  const [mainGameId, setMainGameId] = useState<any>("");
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

  useEffect(() => {
    const shuffled = questions.map((question) => ({
      ...question,
      options: shuffle(question.options),
    }));

    setShuffledQuestions(shuffle(shuffled));
  }, [questions]);

  const createGame = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId }),
      });

      if (!response.ok) {
        throw new Error("Failed to start assessment");
      }

      const { game } = await response.json();

      setMainGameId(game.id);
      console.log(game);
      setGameStarted(true);
    } catch (error) {
      console.error("Error starting assessment:", error);
    }
    setLoading(false);
  };

  return (
    <>
      {gameStarted ? (
        <MCQ quiz={quiz} questions={shuffledQuestions} gameId={mainGameId} />
      ) : (
        <main className="flex flex-col h-[75vh] items-center justify-center gap-5">
          <div className="flex flex-col items-center gap-4">
            <Book width={200} height={200} />
            <span className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
              {quiz.name}
            </span>
          </div>
          <p className="max-w-prose text-center">
            You need to attempt a total of {quiz.questions.length} questions
          </p>
          <Button disabled={loading} onClick={createGame}>
            <Brain size={20} className="mr-2" />
            Start Assessment
            {loading && <Loader2 className="animate-spin ml-2" />}
          </Button>
        </main>
      )}
    </>
  );
}
