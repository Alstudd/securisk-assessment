import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
  const { gameId, timeEnded, mainScore } = await req.json();
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    await prisma.game.update({
      where: { id: gameId },
      data: {
        timeEnded: new Date(timeEnded),
        mainScore,
      },
    });

    return new Response(
      JSON.stringify({ message: "Game ended successfully" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error ending game:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
