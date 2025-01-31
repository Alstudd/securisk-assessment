import { Game as GameModel } from "@prisma/client";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { createClerkClient } from "@clerk/backend";
import { GameCard } from "./GameCard";

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
    return <div>Assessment not found</div>;
  }

  const quizAttemptedByUser = await clerkClient.users.getUser(game.userId);
  const quizAttemptedByUserEmail =
    quizAttemptedByUser.emailAddresses[0]?.emailAddress || "Email not found";
  const quizMadeByUser = await clerkClient.users.getUser(quiz.userId);
  const quizMadeByUserEmail =
    quizMadeByUser.emailAddresses[0]?.emailAddress || "Email not found";

  return (
    <>
      <GameCard userId={userId} quiz={quiz} game={game} quizAttemptedByUserEmail={quizAttemptedByUserEmail} quizMadeByUserEmail={quizMadeByUserEmail} />
    </>
  );
}

export default Game;
