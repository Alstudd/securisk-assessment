import prisma from "@/lib/db/prisma";
import { shuffle } from "@/lib/utils";
import {
  createQuizSchema,
  deleteQuizSchema,
  updateQuizSchema,
} from "@/lib/validation/quiz";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createQuizSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: parseResult.error.flatten() }),
        { status: 400 },
      );
    }

    const { questionBankId, accessEmails, subtopics } = parseResult.data;
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const questionBank = await prisma.questionBank.findUnique({
      where: { id: questionBankId },
      include: { subtopics: { include: { questionSets: true } } },
    });

    if (!questionBank) {
      return new Response(JSON.stringify({ error: "QuestionBank not found" }), {
        status: 404,
      });
    }

    const questions = [];
    for (const { id, questionCount } of subtopics) {
      const subtopic = questionBank.subtopics.find((st) => st.id === id);

      if (!subtopic) {
        return new Response(
          JSON.stringify({ error: `Subtopic ${id} not found` }),
          { status: 404 },
        );
      }

      //   const shuffledQuestions = [...subtopic.questionSets].sort(
      //     () => 0.5 - Math.random(),
      //   );
      const shuffledQuestions = shuffle([...subtopic.questionSets]);

      const selectedQuestions = shuffledQuestions.slice(0, questionCount);

      questions.push(
        ...selectedQuestions.map((qs) => ({
          quest: qs.quest,
          options: qs.options,
          subtopic: { connect: { id: subtopic.id } },
        })),
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        userId,
        questionBankId,
        accessEmails,
        questions: { create: questions },
      },
      include: { questions: true },
    });

    return new Response(JSON.stringify({ quiz }), { status: 201 });
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
    const parseResult = updateQuizSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: parseResult.error.flatten() }),
        { status: 400 },
      );
    }

    const { id, accessEmails, subtopics } = parseResult.data;
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const quiz = await prisma.quiz.findUnique({ where: { id } });

    if (!quiz) {
      return new Response(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
      });
    }

    if (quiz.userId !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const subtopicUpdateData = subtopics
      ? {
          subtopics: {
            update: subtopics.map((subtopic) => ({
              where: { id: subtopic.id },
              data: {
                questionCount: subtopic.questionCount,
              },
            })),
          },
        }
      : {};

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        accessEmails,
        ...subtopicUpdateData,
      },
    });

    return new Response(JSON.stringify({ updatedQuiz }), { status: 200 });
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
    const parseResult = deleteQuizSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: parseResult.error.flatten() }),
        { status: 400 },
      );
    }

    const { id } = parseResult.data;
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const quiz = await prisma.quiz.findUnique({ where: { id } });

    if (!quiz) {
      return new Response(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
      });
    }

    if (quiz.userId !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await prisma.quiz.delete({ where: { id } });

    return new Response(
      JSON.stringify({ message: "Quiz successfully deleted" }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
