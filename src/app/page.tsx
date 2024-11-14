import logo from "@/assets/kavach.png";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex flex-col items-center gap-4">
        <Image src={logo} alt="logo" width={200} height={200} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Kavach Chatbot
        </span>
      </div>
      <p className="max-w-prose text-center">
        An intelligent app with AI integration, built with OpenAI,
        Pinecone, Next.js, Shadcn UI, Clerk, and more.
      </p>
      <Button size="lg" asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}