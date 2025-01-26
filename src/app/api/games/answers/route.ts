import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
  const { gameId, questionId, selectedOption, timeTookToAnswer } =
    await req.json();
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    await prisma.gameAnswer.create({
      data: {
        gameId,
        questionId,
        selectedOption,
        timeTookToAnswer,
      },
    });

    return new Response(
      JSON.stringify({ message: "Answer saved successfully" }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error saving answer:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
