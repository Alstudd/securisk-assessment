import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import { Book, Brain, LucideLayoutDashboard, Menu } from "lucide-react";

const DropdownNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button className="rounded-md">
            <Menu className="h-[1.2rem] w-[1.2rem] scale-100" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <DropdownMenuItem asChild>
          <Link className="text-black" href="/qbs">
            <Book size={20} /> QBs
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="text-black" href="/assessments">
            <Brain size={20} /> Assessments
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="text-black" href="/reports">
            <LucideLayoutDashboard size={20} /> Reports
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownNav;
