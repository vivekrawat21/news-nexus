"use client";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, MessageCircle, Share2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { fetchNews } from "@/lib/util/fetchNews"; // Assuming fetchNews is in a lib directory
import Link from "next/link";

interface Headline {
  title: string;
  views: number;
  comments: number;
  author: string;
  time: string;
  source: string;
  urlToImage: string | null;
  url: string;
  publishedAt: string;
  description: string;
  content: string;
}

export default function Home() {
  const { userId } = useAuth();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [visibleHeadlines, setVisibleHeadlines] = useState<Headline[]>([]);
  const [fullNews, setFullNews] = useState<Headline | null>(null);
  const [openNewsModal, setOpenNewsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<string[]>([]); // State to store authors dynamically

  const defaultVisibleCount = 9; // Number of headlines initially visible

  const [filters, setFilters] = useState({
    search: "",
    sortBy: "views", // Default to sorting by views
    author: "", // New filter for author
  });

  // Generate fake views and comments count
  const generateFakeCount = () => Math.floor(Math.random() * 1000) + 100;

  useEffect(() => {
    const loadHeadlines = async () => {
      setLoading(true);
      const articles = await fetchNews();
      const fetchedHeadlines = articles.map((article: Headline) => {
        // Ensure only one or two authors are shown
        const articleAuthors = article.author
          ? article.author.split(",").slice(0, 2).join(", ")
          : "Unknown Author";

        return {
          title: article.title,
          views: article.views || generateFakeCount(), // Generate fake count if missing
          comments: article.comments || generateFakeCount(), // Generate fake count if missing
          author: articleAuthors, // Set authors
          time: new Date(article.publishedAt).toLocaleTimeString(),
          urlToImage: article.urlToImage,
          url: article.url,
          publishedAt: article.publishedAt,
          description: article.description || "No description available.",
          content: article.content || "No full content available.",
        };
      });

      setHeadlines(fetchedHeadlines);
      setVisibleHeadlines(fetchedHeadlines.slice(0, defaultVisibleCount));
      setLoading(false);

      // Extract authors and filter out duplicates
      const authorsList = fetchedHeadlines
        .map((article: { author: string; }) => article.author)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((author: any, index: any, self: string | any[]) => self.indexOf(author) === index); // Get unique authors
      setAuthors(authorsList);
    };

    loadHeadlines();
  }, []);

  const loadMoreHeadlines = () => {
    const newVisibleHeadlines = headlines.slice(
      0,
      visibleHeadlines.length + defaultVisibleCount
    );
    setVisibleHeadlines(newVisibleHeadlines);
  };

  const seeLessHeadlines = () => {
    setVisibleHeadlines(headlines.slice(0, defaultVisibleCount));
  };

  const openFullNews = (headline: Headline) => {
    if (!userId) {
      setOpenLoginModal(true);
      return;
    }

    setFullNews(headline);
    setOpenNewsModal(true);
  };

  // Filter headlines based on search, sort, and author
  const filteredHeadlines = headlines
    .filter(
      (headline) =>
        headline?.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.author
          ? headline.author
              ?.toLowerCase()
              .includes(filters.author.toLowerCase())
          : true)
    )
    .sort((a, b) => {
      if (filters.sortBy === "views") {
        return b.views - a.views;
      }
      if (filters.sortBy === "comments") {
        return b.comments - a.comments;
      }
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ); // Sort by date
    });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden border-r md:block md:w-64">
        <Sidebar
          filters={filters}
          authors={authors}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="flex w-full flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
          <div className="flex items-center gap-4">
            <MobileNav filters={filters} onFilterChange={handleFilterChange} authors={authors} />
            <MainNav />
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px]"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1">
          <div className="container mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Today{"'"}s Headlines
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredHeadlines.length === 0 ? (
                  <div>No headlines available</div>
                ) : (
                  filteredHeadlines
                    .slice(0, visibleHeadlines.length)
                    .map((headline, index) => (
                      <Card
                        key={`${headline.url}-${headline.publishedAt}-${index}`}
                        className="flex flex-col"
                        onClick={() => openFullNews(headline)}
                      >
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                          <div className="aspect-video w-[120px] flex-none overflow-hidden rounded-md">
                            {headline.urlToImage ? (
                              <img
                                src={headline.urlToImage}
                                alt={headline.title}
                                width={120}
                                height={67}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-600">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <CardTitle className="line-clamp-2 text-base">
                              {headline.title}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {headline.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {headline.comments}
                              </span>
                              <button className="flex items-center gap-1 hover:text-primary">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{headline.author || "Unknown Author"}</span>
                              <span>•</span>
                              <span>
                                {headline.publishedAt
                                  ? new Date(
                                      headline.publishedAt
                                    ).toLocaleDateString()
                                  : "Unknown Date"}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))
                )}
              </div>
              {!loading && (
                <div className="flex justify-center mt-6 space-x-4">
                  {filteredHeadlines.length > visibleHeadlines.length && (
                    <Button variant="outline" onClick={loadMoreHeadlines}>
                      Load More
                    </Button>
                  )}
                  {filteredHeadlines.length > defaultVisibleCount &&
                    visibleHeadlines.length > defaultVisibleCount && (
                      <Button variant="outline" onClick={seeLessHeadlines}>
                        See Less
                      </Button>
                    )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for login prompt */}
      {openLoginModal && (
        <div className="fixed inset-0 z-50 bg-gray-950 bg-opacity-60 flex justify-center items-center backdrop-blur-sm shadow-lg ">
          <div className="bg-white dark:bg-black p-6 rounded-md max-w-sm w-full">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Please Log In
            </h2>
            <p className="mt-2 text-sm text-gray-800 dark:text-gray-300">
              You need to log in to view the full news.
            </p>
            <div className="mt-4 flex justify-between">
              <Button
                variant="ghost"
                className="text-gray-900 dark:text-white"
                onClick={() => setOpenLoginModal(false)}
              >
                Cancel
              </Button>
              <Link href="/sign-in">
                <Button className="bg-gray-950 hover:bg-gray-850 border-[1px] border-white text-white">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal for full news */}
      {openNewsModal && fullNews && (
        <div className="fixed inset-0 z-50 bg-gray-950 bg-opacity-60 flex justify-center items-center backdrop-blur-sm shadow-lg ">
          <div className="bg-white dark:bg-black p-6 rounded-md max-w-xl w-full overflow-auto">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              {fullNews.title}
            </h2>
            {fullNews.urlToImage && (
              <img
                src={fullNews.urlToImage}
                alt={fullNews.title}
                className="mt-4 max-h-96 object-cover"
              />
            )}
            <p className="mt-4 text-gray-800 dark:text-gray-300">
              {fullNews.content}
            </p>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setOpenNewsModal(false)}>
                Close
              </Button>
              <Link href={fullNews.url} target="_blank">
                <Button variant="outline">Read Full Article</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
