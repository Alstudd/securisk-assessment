import React from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Note";

export const metadata: Metadata = {
  title: "Kavach ChatBot - Disasters",
};

type Props = {};

const Notes = async (props: Props) => {
  const { userId } = auth();
  if (!userId) throw Error("userId undefined");
  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {'No disasters found. Click on the "Add Disaster" button to add a disaster.'}
        </div>
      )}
    </div>
  );
};

export default Notes;
