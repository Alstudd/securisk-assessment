import prisma from "@/lib/db/prisma";
import {
  createQuestionBankSchema,
  deleteQuestionBankSchema,
  updateQuestionBankSchema,
  updateQuestionBankTopicSchema,
} from "@/lib/validation/questionBank";
import { auth } from "@clerk/nextjs";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const questionBanks = await prisma.questionBank.findMany({
      where: { userId },
      include: { subtopics: { include: { questionSets: true } } },
    });

    return new Response(JSON.stringify({ questionBanks }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const parseResult = createQuestionBankSchema.safeParse(body);
    console.log(parseResult);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
      });
    }

    const { topic, subtopics } = parseResult.data;
    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const questionBank = await prisma.questionBank.create({
      data: {
        topic,
        userId,
        subtopics: {
          create: subtopics.map(({ name, questionSets }) => ({
            name,
            questionSets: {
              create: questionSets.map(({ quest, options }) => ({
                quest,
                options,
              })),
            },
          })),
        },
      },
      include: { subtopics: { include: { questionSets: true } } },
    });

    return new Response(JSON.stringify({ questionBank }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateQuestionBankSchema.safeParse(body);
    const parseTopicResult = updateQuestionBankTopicSchema.safeParse(body);
    if (!parseResult.success && !parseTopicResult.success) {
      console.error(parseResult.error);
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
      });
    }

    if (parseResult.success) {
      const { id, topic, subtopics } = parseResult.data;
      const questionBank = await prisma.questionBank.findUnique({
        where: { id },
        include: { subtopics: { include: { questionSets: true } } },
      });

      if (!questionBank) {
        return new Response(
          JSON.stringify({ error: "QuestionBank not found" }),
          {
            status: 404,
          },
        );
      }

      const { userId } = auth();
      if (!userId || userId !== questionBank.userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }

      const updatedQuestionBank = await prisma.$transaction(async (tx) => {
        await tx.subtopic.deleteMany({ where: { questionBankId: id } });
        return await tx.questionBank.update({
          where: { id },
          data: {
            topic,
            subtopics: {
              create: subtopics.map(({ name, questionSets }) => ({
                name,
                questionSets: {
                  create: questionSets.map(({ quest, options }) => ({
                    quest,
                    options,
                  })),
                },
              })),
            },
          },
          include: { subtopics: { include: { questionSets: true } } },
        });
      });

      return new Response(JSON.stringify({ updatedQuestionBank }), {
        status: 200,
      });
    } else if (parseTopicResult.success) {
      const { id, topic } = parseTopicResult.data;
      const updatedQuestionBank = await prisma.questionBank.update({
        where: { id },
        data: { topic },
        include: { subtopics: { include: { questionSets: true } } },
      });

      return new Response(JSON.stringify({ updatedQuestionBank }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteQuestionBankSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
      });
    }

    const { id } = parseResult.data;
    const questionBank = await prisma.questionBank.findUnique({
      where: { id },
    });

    if (!questionBank) {
      return new Response(JSON.stringify({ error: "QuestionBank not found" }), {
        status: 404,
      });
    }

    const { userId } = auth();
    if (!userId || userId !== questionBank.userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.subtopic.deleteMany({ where: { questionBankId: id } });
      await tx.questionBank.delete({ where: { id } });
    });

    return new Response(JSON.stringify({ message: "QuestionBank deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
