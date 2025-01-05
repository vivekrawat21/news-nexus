export const fetchNews = async () => {

  try {
    const response = await fetch(
      `https:newsapi.org/v2/everything?q=tesla&from=2024-12-05&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );
    const data = await response.json();
    console.log(data)
    return data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
