import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import Game from "@/components/Game";
import { Game as GameModel } from "@prisma/client";

export const metadata: Metadata = {
  title: "Transformatrix Quiz - Games",
};

const Quizzes = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  // Because of access protection
  // const allGames: GameModel[] = await prisma.game.findMany({
  //   where: { userId },
  // });
  const allGames: GameModel[] = await prisma.game.findMany();
  const userGames: GameModel[] = [];
  for (const game of allGames) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: game.quizId },
      select: { userId: true },
    });
    if (quiz?.userId === userId) {
      userGames.push(game);
    } else if (game.userId === userId) {
      userGames.push(game);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">
          Games {userGames.length > 0 && `(${userGames.length})`}
        </h1>
      </div>
      <hr className="border-gray-300" />
      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {userGames.map((item) => <Game game={item} key={item.id} />).reverse()}
        {userGames.length === 0 && (
          <div className="col-span-full text-center">
            {"No games found. Play a game of quiz."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
