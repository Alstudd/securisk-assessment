"use client";

import {
  QuestionBank as QuestionBankModel,
  Subtopic as SubtopicModel,
} from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AddEditQuestionBankDialog from "./AddEditQuestionBankDialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";

interface QuestionBankProps {
  questionBank: QuestionBankModel & { subtopics: SubtopicModel[] };
}

export default function QuestionBank({ questionBank }: QuestionBankProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const wasUpdated = questionBank.updatedAt > questionBank.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? questionBank.updatedAt : questionBank.createdAt
  ).toDateString();
  return (
    <>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle>{questionBank.topic}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {questionBank.subtopics.map((subtopic) => (
              <div
                className="rounded-md bg-blue-500 p-2 text-[13px] font-medium text-white"
                key={subtopic.id}
              >
                {subtopic.name}
              </div>
            ))}
          </div>
          <Button onClick={() => setShowEditDialog(true)}>
            <Edit size={20} className="mr-2" />
            Update QB
          </Button>
        </CardContent>
      </Card>
      <AddEditQuestionBankDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        questionBankToEdit={questionBank}
      />
    </>
  );
}
