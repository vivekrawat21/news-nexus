import axios from 'axios';


export const fetchNews = async () => {

  try {
    const response = await axios.get(
      `https:newsapi.org/v2/everything?q=tesla&from=2024-12-05&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
