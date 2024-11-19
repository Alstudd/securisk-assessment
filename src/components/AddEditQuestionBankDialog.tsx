import {
  CreateQuestionBankSchema,
  createQuestionBankSchema,
} from "@/lib/validation/questionBank";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { QuestionBank, Subtopic } from "@prisma/client";
import { useState } from "react";
import * as XLSX from "xlsx";

interface AddEditQuestionBankDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  questionBankToEdit?: QuestionBank & { subtopics: Subtopic[] };
}

export default function AddEditQuestionBankDialog({
  open,
  setOpen,
  questionBankToEdit,
}: AddEditQuestionBankDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      topic: questionBankToEdit?.topic || "",
    },
  });

  async function handleFileParsing() {
    if (!uploadedFile) return [];

    try {
      if (uploadedFile.name.endsWith(".json")) {
        const text = await uploadedFile.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data.subtopics))
          throw new Error("Invalid JSON format");
        return data.subtopics;
      }

      if (uploadedFile.name.endsWith(".xlsx")) {
        const data = await uploadedFile.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        return rows.reduce((acc: any, row: any) => {
          const subtopicName = row.Subtopic || "Untitled Subtopic";
          const question = {
            quest: row.Question || "Untitled Question",
            options: [
              {
                name: row.Option1,
                score: 5,
              },
              {
                name: row.Option2,
                score: 4,
              },
              {
                name: row.Option3,
                score: 3,
              },
              {
                name: row.Option4,
                score: 2,
              },
              {
                name: row.Option5,
                score: 1,
              },
            ].filter((o: any) => o.name),
          };

          if (!question.options.length) return acc;

          let subtopic = acc.find((s: any) => s.name === subtopicName);
          if (!subtopic) {
            subtopic = { name: subtopicName, questionSets: [] };
            acc.push(subtopic);
          }
          subtopic.questionSets.push(question);
          return acc;
        }, []);
      }

      throw new Error("Unsupported file format");
    } catch (err: any) {
      setFileError(err.message);
      return [];
    }
  }

  async function onSubmit(input: any) {
    try {
      setFileError(null);
      const subtopics = await handleFileParsing();

      const payload = {
        topic: input.topic,
        subtopics,
      };

      if (questionBankToEdit) {
        if (!subtopics.length) {
          const response = await fetch("/api/questionBanks", {
            method: "PUT",
            body: JSON.stringify({
              id: questionBankToEdit?.id,
              topic: input.topic,
            }),
          });
          if (!response.ok)
            throw new Error(`Request failed with status: ${response.status}`);
        } else {
          const response = await fetch("/api/questionBanks", {
            method: "PUT",
            body: JSON.stringify({
              id: questionBankToEdit?.id,
              ...payload,
            }),
          });
          if (!response.ok)
            throw new Error(`Request failed with status: ${response.status}`);
        }
      } else {
        const response = await fetch("/api/questionBanks", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!response.ok)
          throw new Error(`Request failed with status: ${response.status}`);
      }

      form.reset();
      setUploadedFile(null);
      setOpen(false);
      router.refresh();
      if (questionBankToEdit) window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }

  async function deleteQuestionBank() {
    if (!questionBankToEdit) return;

    try {
      setDeleteInProgress(true);
      const response = await fetch("/api/questionBanks", {
        method: "DELETE",
        body: JSON.stringify({ id: questionBankToEdit.id }),
      });

      if (!response.ok)
        throw new Error(`Request failed with status: ${response.status}`);

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.files);
    const file = event.target.files?.[0] || null;
    if (file && !/\.json$|\.xlsx$/.test(file.name)) {
      setFileError("Only JSON or Excel files are supported");
      setUploadedFile(null);
    } else {
      setFileError(null);
      setUploadedFile(file);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {questionBankToEdit ? "Edit Question Bank" : "Add Question Bank"}
            {questionBankToEdit && (
              <span className="text-sm text-gray-500 ml-2">
                (Warning: Uploading a new file replaces data. <br/>If no quizzes use this question bank, then go ahead!)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Bank Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-3">
              <FormLabel>
                {questionBankToEdit
                  ? "Change JSON or Excel File"
                  : "Upload JSON or Excel File"}
              </FormLabel>
              <input
                type="file"
                accept=".json, .xlsx"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
              />
              {fileError && <p className="text-sm text-red-500">{fileError}</p>}
            </div>
            <DialogFooter className="gap-1 sm:gap-0">
              {questionBankToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteQuestionBank}
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
