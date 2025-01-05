// Define the same type for articles used in the API route
  export type NewsArticle = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  views: number | null;
  comments: number | null;


};

export const fetchNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch('/api/news'); // Internal API route
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    console.log(data);
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
