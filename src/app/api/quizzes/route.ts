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

    const {
      name,
      questionBankId,
      accessEmails,
      questionCount,
      timer,
      subtopics,
    } = parseResult.data;
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
    for (const { id } of subtopics) {
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
          scenario: qs.scenario,
          quest: qs.quest,
          options: qs.options,
          subtopic: { connect: { id: subtopic.id } },
        })),
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        name,
        userId,
        questionCount,
        questionBankId,
        accessEmails,
        timer,
        questions: { create: questions.reverse() },
      },
      include: { questions: true },
    });

    return new Response(JSON.stringify({ newQuiz: quiz }), { status: 201 });
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

    const {
      id,
      questionBankId,
      name,
      accessEmails,
      subtopics,
      questionCount,
      timer,
    } = parseResult.data;
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

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

    const currentSubtopics = quiz.questions.map((q) => q.subtopicId);

    const removedSubtopicIds = currentSubtopics.filter(
      (id) => !subtopics.some((subtopic) => subtopic.id === id),
    );

    if (removedSubtopicIds.length > 0) {
      await prisma.quizQuestion.deleteMany({
        where: {
          subtopicId: { in: removedSubtopicIds },
          quizId: quiz.id,
        },
      });
    }

    const subtopicUpdateData = subtopics.map(async (subtopic) => {
      const selectedSubtopic = await prisma.subtopic.findUnique({
        where: { id: subtopic.id },
        include: { questionSets: true },
      });

      if (!selectedSubtopic) {
        throw new Error(`Subtopic ${subtopic.id} not found`);
      }

      const shuffledQuestions = shuffle([...selectedSubtopic.questionSets]);

      const selectedQuestions = shuffledQuestions.slice(0, questionCount);

      const quizQuestions = selectedQuestions.map((qs) => ({
        scenario: qs.scenario,
        quest: qs.quest,
        options: qs.options,
        subtopicId: subtopic.id,
      }));

      return quizQuestions;
    });

    const allQuizQuestions = await Promise.all(subtopicUpdateData).then((res) =>
      res.flat(),
    );

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        name,
        accessEmails,
        questionCount,
        timer,
        questions: {
          // delete all and recreate
          deleteMany: {},
          create: allQuizQuestions,
        },
      },
      include: { questions: true },
    });

    return new Response(JSON.stringify({ newQuiz: updatedQuiz }), {
      status: 200,
    });
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

    await Promise.all([
      prisma.quizQuestion.deleteMany({ where: { quizId: id } }),
      prisma.quiz.delete({ where: { id } }),
    ]);

    return new Response(JSON.stringify({ message: "Quiz deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
