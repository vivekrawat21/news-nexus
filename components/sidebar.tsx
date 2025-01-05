import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface SidebarProps {
  filters: { sortBy: string; author: string };
  authors: string[]; // Accept authors as a prop
  onFilterChange: (key: string, value: string) => void;
}

export function Sidebar({ filters, authors, onFilterChange }: SidebarProps) {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  const filterOptions = [
    { label: "No Filter", value: "no_filter" },
    { label: "Most Viewed", value: "views" },
    { label: "Most Commented", value: "comments" },
    { label: "Latest", value: "date" },
  ];

  const handleFilterChange = (key: string, value: string) => {
    if (value === "no_filter") {
      onFilterChange(key, ""); // Clear filter when "No Filter" is selected
    } else {
      onFilterChange(key, value);
    }
  };

  return (
    <div className="space-y-6 p-4 border-r bg-background/95 backdrop-blur-sm h-full flex flex-col">
      {/* Logo Placeholder */}
      <div className="flex justify-center mb-6">
        <div className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          LOGO
        </div>
      </div>

      {/* Conditionally Render Filters Section */}
      {isSignedIn && (
        <div className="space-y-4 flex-1">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Filters</h2>

          {/* Select Filter for sorting */}
          <Select
            value={filters.sortBy === "" ? "no_filter" : filters.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger className="w-full py-2 px-3 text-sm bg-transparent border border-gray-300 dark:border-gray-600 dark:text-white rounded-md focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Select Sort Type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md">
              {filterOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800/50"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select Filter for author */}
          <Select
            value={filters.author === "" ? "no_filter" : filters.author}
            onValueChange={(value) => handleFilterChange("author", value)}
          >
            <SelectTrigger className="w-full py-2 px-3 text-sm bg-transparent border border-gray-300 dark:border-gray-600 dark:text-white rounded-md focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Select Author" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md">
              <SelectItem value="no_filter" className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800/50">
                No Filter
              </SelectItem>
              {authors.map((author) => (
                <SelectItem
                  key={author}
                  value={author}
                  className="text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800/50"
                >
                  {author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* LogOut Button */}
      <div className="mt-auto">
        {isSignedIn ? (
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800/50"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        ) : (
          <div className="flex-1 flex items-center justify-center mt-6">
            <div className="rounded-lg bg-primary/10 p-4 w-full">
              <h3 className="font-semibold text-gray-800 dark:text-white">Join our community</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                To explore all news and share it with your social circle
              </p>
              <Button className="mt-4 w-full">
                <Link href="sign-up">Sign up Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
