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
    const quizExists = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quizExists) {
      return new Response(JSON.stringify({ message: "Quiz not found" }), {
        status: 404,
      });
    }

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

export async function DELETE(req: Request) {
  const { id }: { id: string } = await req.json();
  const { userId } = auth();
  
  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  
  try {
    const game = await prisma.game.findUnique({
      where: {
        id,
      },
    });
    
    if (!game) {
      return new Response(JSON.stringify({ message: "Game not found" }), {
        status: 404,
      });
    }

    const quizId = game?.quizId;

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
    });

    if (!quiz) {
      return new Response(JSON.stringify({ message: "Quiz not found" }), {
        status: 404,
      });
    }

    if (quiz.userId !== userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await Promise.all([
      prisma.gameAnswer.deleteMany({
        where: {
          gameId: id,
        },
      }),
      prisma.game.delete({
        where: {
          id,
        },
      }),
    ]);

    return new Response(JSON.stringify({ message: "Game deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting game:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
