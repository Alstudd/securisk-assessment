"use client";

import logo from "@/assets/logo.png";
import AddEditQuizDialog from "@/components/AddEditQuizDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Book, Brain, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DropdownNav from "@/components/DropdownNav";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [showAddEditQuizDialog, setShowAddEditQuizDialog] = useState(false);

  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              className="rounded-md"
              src={logo}
              alt="logo"
              width={55}
              height={55}
            />
            <span className="font-bold">Securisk Assessment</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.4rem", height: "2.4rem" } },
              }}
            />
            <ThemeToggleButton />
            {pathname === "/assessments" && (
              <Button onClick={() => setShowAddEditQuizDialog(true)}>
                <Plus size={20} className="mr-2" />
                Add Assessment
              </Button>
            )}
            <DropdownNav />
          </div>
        </div>
      </div>
      <AddEditQuizDialog
        open={showAddEditQuizDialog}
        setOpen={setShowAddEditQuizDialog}
      />
    </>
  );
}
