"use client";

import logo from "@/assets/logo.png";
import AddEditQuestionBankDialog from "@/components/AddEditQuestionBankDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Plus } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DropdownNav from "@/components/DropdownNav";

export default function NavBar() {
  const { theme } = useTheme();
  const { user } = useUser();

  const [showAddEditQuestionBankDialog, setShowAddEditQuestionBankDialog] =
    useState(false);

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
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <ThemeToggleButton />
            {(user?.emailAddresses[0]?.emailAddress ===
              "souzaagnel@gmail.com" ||
              user?.emailAddresses[0]?.emailAddress ===
                "alstonsoares17@gmail.com") && (
              <Button onClick={() => setShowAddEditQuestionBankDialog(true)}>
                <Plus size={20} className="mr-2" />
                Add QB
              </Button>
            )}
            <DropdownNav />
          </div>
        </div>
      </div>
      <AddEditQuestionBankDialog
        open={showAddEditQuestionBankDialog}
        setOpen={setShowAddEditQuestionBankDialog}
      />
    </>
  );
}
