import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { QuestionBank, Quiz, Subtopic } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

interface SubtopicWithSelected extends Subtopic {
  selected?: boolean;
}

interface AddEditQuizDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  quizToEdit?: {
    id: string;
    name: string;
    questionCount: number;
    questionBankId: string;
    accessEmails: string[];
    questionBank: {
      topic: string;
      subtopics: SubtopicWithSelected[];
    };
    questions: {
      id: string;
      subtopicId: string;
      subtopic: Subtopic;
    }[];
  };
}

export default function AddEditQuizDialog({
  open,
  setOpen,
  quizToEdit,
}: AddEditQuizDialogProps) {
  const [questionBanks, setQuestionBanks] = useState<
    (QuestionBank & { subtopics: Subtopic[] })[]
  >([]);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [questionBankId, setQuestionBankId] = useState<string | null>(
    quizToEdit?.questionBankId || null,
  );
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [accessEmails, setAccessEmails] = useState<string[]>(
    quizToEdit?.accessEmails || [],
  );
  const [newEmails, setNewEmails] = useState<string[]>([]);
  const [inputEmail, setInputEmail] = useState("");
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      questionCount: quizToEdit?.questionCount || 1,
      quizName: quizToEdit?.name || "",
    },
  });

  useEffect(() => {
    if (quizToEdit) {
      const uniqueSubtopics = quizToEdit.questions.reduce(
        (acc: any[], question) => {
          const subtopicExists = acc.some(
            (sub) => sub.id === question.subtopicId,
          );
          if (!subtopicExists) {
            acc.push({ ...question.subtopic, selected: true });
          }
          return acc;
        },
        [],
      );
      const quesB = questionBanks.find(
        (qb) => qb.id === quizToEdit.questionBankId,
      );

      if (quesB) {
        const updatedSubtopics = quesB.subtopics.map((subtopic) => {
          const matchingSubtopic = uniqueSubtopics.find(
            (unique) => unique.id === subtopic.id,
          );

          return {
            ...subtopic,
            selected: matchingSubtopic ? true : false,
          };
        });
        setSubtopics(updatedSubtopics);
      }

      setQuestionBankId(quizToEdit.questionBankId);
    }
  }, [quizToEdit, questionBanks]);

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const response = await fetch("/api/questionBanks");
        if (!response.ok)
          throw new Error(`Request failed with status: ${response.status}`);
        const data = await response.json();
        setQuestionBanks(data.questionBanks);
      } catch (error) {
        console.error(error);
        alert("Error fetching question banks. Please try again.");
      }
    };

    fetchQuestionBanks();
  }, []);

  const handleSubtopicSelection = (id: string, selected: boolean) => {
    setSubtopics((prev) =>
      prev.map((subtopic) =>
        subtopic.id === id ? { ...subtopic, selected } : subtopic,
      ),
    );
  };

  const handleAddEmail = () => {
    if (
      inputEmail &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail) &&
      !accessEmails.includes(inputEmail) &&
      !newEmails.includes(inputEmail)
    ) {
      setAccessEmails((prev) => [...prev, inputEmail]);
      setNewEmails((prev) => [...prev, inputEmail]);
      setInputEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setAccessEmails((prev) => prev.filter((e) => e !== email));
    setNewEmails((prev) => prev.filter((e) => e !== email));
  };

  const sendMail = async ({
    subject,
    message,
    emails,
    quizName,
    quizId,
    totalQuestionCount,
  }: {
    subject: string;
    message: string;
    emails: string[];
    quizName: string;
    quizId: string;
    totalQuestionCount: number;
  }) => {
    try {
      const response = await fetch("/api/sendQuizMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
          emails,
          quizName,
          quizId,
          totalQuestionCount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to send mail. Status: ${response.status}. Message: ${errorData.message}`,
        );
      }

      console.log("Mail sent successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to send mail:", error.message);
      } else {
        console.error("Unexpected error occurred:", error);
      }
    }
  };

  const onSubmit = async (input: any) => {
    try {
      if (input.questionCount < 1) {
        alert("Please enter a valid question count.");
        return;
      }
      if (input.questionCount > subtopics[0].questionSets.length) {
        alert("Question count exceeds available questions.");
        return;
      }
      const selectedSubtopics = subtopics
        .filter((subtopic) => subtopic.selected)
        .map((subtopic) => ({
          id: subtopic.id,
          questions: subtopic.questionSets,
        }));

      const payload = {
        name: input.quizName,
        questionBankId,
        subtopics: selectedSubtopics,
        questionCount: Number(input.questionCount),
        accessEmails,
      };

      console.log(payload);

      const url = "/api/quizzes";
      const method = quizToEdit ? "PUT" : "POST";
      const body = JSON.stringify(
        quizToEdit
          ? {
              id: quizToEdit.id,
              ...payload,
            }
          : payload,
      );

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save quiz: ${errorData.message}`);
      }

      const { newQuiz } = await response.json();
      console.log(newQuiz);
      await sendMail({
        subject: quizToEdit ? "Quiz updated" : "New quiz created",
        message: quizToEdit
          ? "your assigned quiz has been updated"
          : "you have been assigned a quiz",
        // emails: quizToEdit ? newEmails : accessEmails,
        emails: accessEmails,
        quizName: newQuiz.name,
        quizId: newQuiz.id,
        totalQuestionCount: newQuiz.questions.length,
      });

      form.reset();
      setAccessEmails([]);
      setNewEmails([]);
      setQuestionBankId(null);
      setSubtopics([]);
      setOpen(false);
      router.refresh();
      if (quizToEdit) window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        alert("Unexpected error occurred. Please try again.");
      }
    }
  };

  const deleteQuiz = async () => {
    if (!quizToEdit) return;

    try {
      setDeleteInProgress(true);
      const response = await fetch("/api/quizzes", {
        method: "DELETE",
        body: JSON.stringify({ id: quizToEdit.id }),
      });
      if (!response.ok)
        throw new Error(`Request failed with status: ${response.status}`);
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error deleting quiz. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quizToEdit ? "Edit Quiz" : "Add Quiz"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormItem>
              <FormLabel>Question Bank Topic</FormLabel>
              <Select
                disabled={quizToEdit ? true : false}
                value={questionBankId || ""}
                onValueChange={(value) => {
                  const selectedQB = questionBanks.find(
                    (qb) => qb.id === value,
                  );
                  setQuestionBankId(value);
                  setSubtopics(
                    selectedQB?.subtopics.map((sub) => ({
                      ...sub,
                      selected: false,
                    })) || [],
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      questionBanks.find((qb) => qb.id === questionBankId)
                        ?.topic || "Select a topic"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Topics</SelectLabel>
                    {questionBanks.map((qb) => (
                      <SelectItem key={qb.id} value={qb.id}>
                        {qb.topic}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>

            <FormField
              control={form.control}
              name="quizName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Enter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Count</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Enter count" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-4">
              {subtopics.map((sub) => (
                <div key={sub.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sub.selected || false}
                    onChange={(e) =>
                      handleSubtopicSelection(sub.id, e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  <label>{sub.name}</label>
                </div>
              ))}
            </div>

            <FormItem>
              <FormLabel>Access Emails</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="Add email"
                    type="email"
                  />
                  <Button onClick={handleAddEmail} type="button">
                    <Plus />
                  </Button>
                </div>
              </FormControl>
            </FormItem>

            <div className="flex flex-wrap gap-2">
              {accessEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center space-x-2 rounded bg-blue-500 p-2 text-white"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <DialogFooter>
              {quizToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteQuiz}
                  type="button"
                >
                  Delete
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
