import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { quizId }: { quizId: string } = await req.json();
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Validate if quiz exists
    const quizExists = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quizExists) {
      return new Response(JSON.stringify({ message: "Quiz not found" }), {
        status: 404,
      });
    }

    // Check for existing game
    const existingGame = await prisma.game.findFirst({
      where: {
        userId,
        quizId,
      },
    });

    if (existingGame) {
      return new Response(
        JSON.stringify({
          message: "Game already exists for this quiz",
          game: existingGame,
        }),
        { status: 409 },
      );
    }

    // Create new game
    const game = await prisma.game.create({
      data: {
        userId,
        quizId,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Game created successfully",
        game,
        quizName: quizExists.name,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating game:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
