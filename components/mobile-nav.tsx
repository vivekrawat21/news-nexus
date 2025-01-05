import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

interface MobileNavProps {
  filters: {
    sortBy: string;
    author: string;
    
  };
  onFilterChange: (key: string, value: string) => void;
  authors: string[];
}

export function MobileNav({ filters, onFilterChange, authors }: MobileNavProps) {
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
        {/* Pass the appropriate filters and onFilterChange */}
        <Sidebar filters={filters} onFilterChange={onFilterChange} authors={authors} />
      </SheetContent>
    </Sheet>
  );
}
