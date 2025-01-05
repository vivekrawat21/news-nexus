// MobileNav.tsx
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

interface MobileNavProps {
  onFilterChange: (key: string, value: string) => void;
}

export function MobileNav({ onFilterChange }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4">
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        {/* Pass the onFilterChange to the Sidebar */}
        <Sidebar filters={{}} onFilterChange={onFilterChange} />
      </SheetContent>
    </Sheet>
  );
}
