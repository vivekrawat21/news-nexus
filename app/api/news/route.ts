import { NextResponse } from 'next/server';

// Define types for the news response
type NewsArticle = {
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

type NewsResponse = {
  articles: NewsArticle[];
};

export async function GET() {

  

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/everything?q=tesla&from=2024-12-06&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: response.status });
    }

    
    const data :NewsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
