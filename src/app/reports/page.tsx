import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import Game from "@/components/Game";
import { Game as GameModel } from "@prisma/client";
import { createClerkClient } from "@clerk/backend";

export const metadata: Metadata = {
  title: "Securisk Assessment - Reports",
};

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const Reports = async () => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");

  // Because of access protection
  // const allGames: GameModel[] = await prisma.game.findMany({
  //   where: { userId },
  // });
  const currentUser = await clerkClient.users.getUser(userId);
  const currentUserIsAdmin =
    currentUser?.emailAddresses[0]?.emailAddress === "alstonsoares17@gmail.com";
  const allGames: GameModel[] = await prisma.game.findMany({
    orderBy: { updatedAt: "desc" },
  });
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
      {(currentUserIsAdmin ? allGames.length > 0 : userGames.length > 0) && (
        <>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              Reports ({currentUserIsAdmin ? allGames.length : userGames.length}
              )
            </h1>
          </div>
          <hr className="border-gray-300" />
        </>
      )}
      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {currentUserIsAdmin
          ? allGames.map((item) => <Game game={item} key={item.id} />)
          : userGames.map((item) => <Game game={item} key={item.id} />)}
        {(currentUserIsAdmin
          ? allGames.length === 0
          : userGames.length === 0) && (
          <div className="col-span-full text-center">
            {
              "No reports found. Take or share an assessment to generate a report."
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
