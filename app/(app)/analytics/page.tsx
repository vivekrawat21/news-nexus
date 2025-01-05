"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchNews } from "@/lib/util/fetchNews";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

// Define types
type NewsArticle = {
  source: {
    name: string;
  };
  publishedAt: string;
};

type SourceDistribution = {
  name: string;
  count: number;
};

type TimeDistribution = {
  timeRange: string;
  count: number;
};

// Helper function to calculate source distribution
const getSourceDistribution = (data: NewsArticle[]): SourceDistribution[] => {
  const sourceCount: Record<string, number> = {};
  data.forEach((news) => {
    const sourceName = news.source.name || "Unknown Source";
    sourceCount[sourceName] = (sourceCount[sourceName] || 0) + 1;
  });
  return Object.entries(sourceCount).map(([name, count]) => ({ name, count }));
};

// Helper function to calculate publication time distribution
const getTimeDistribution = (data: NewsArticle[]): TimeDistribution[] => {
  const timeBuckets: Record<string, number> = {
    "00:00-06:00": 0,
    "06:00-12:00": 0,
    "12:00-18:00": 0,
    "18:00-24:00": 0,
  };
  data.forEach((news) => {
    const hour = new Date(news.publishedAt).getHours();
    if (hour < 6) timeBuckets["00:00-06:00"]++;
    else if (hour < 12) timeBuckets["06:00-12:00"]++;
    else if (hour < 18) timeBuckets["12:00-18:00"]++;
    else timeBuckets["18:00-24:00"]++;
  });
  return Object.entries(timeBuckets).map(([timeRange, count]) => ({
    timeRange,
    count,
  }));
};

// Chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsPage = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAndAnalyzeNews = async () => {
      const articles = await fetchNews();
      setNewsData(articles);
      setLoading(false);
    };

    fetchAndAnalyzeNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading news data...</p>
      </div>
    );
  }

  const sourceData = getSourceDistribution(newsData);
  const timeData = getTimeDistribution(newsData);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">News Analytics</h2>
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="source-analysis">Source Analysis</TabsTrigger>
          <TabsTrigger value="time-analysis">Time Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Quick insights from the fetched news data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg font-semibold">
                  Total Articles Fetched:{" "}
                  <span className="font-normal">{newsData.length}</span>
                </p>
                <p className="text-lg font-semibold">
                  Unique Sources:{" "}
                  <span className="font-normal">{sourceData.length}</span>
                </p>
                <p className="text-lg font-semibold">
                  Most Recent Article:{" "}
                  <span className="font-normal">
                    {newsData[0]
                      ? new Date(newsData[0].publishedAt).toLocaleString()
                      : "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={500}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      dataKey="count"
                      nameKey="name"
                      cx="40%"
                      cy="40%"
                      outerRadius={112}
                      innerRadius={40}
                      fill="#8884d8"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {sourceData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="source-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Source Distribution</CardTitle>
              <CardDescription>
                A breakdown of news articles by their sources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={sourceData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="time-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Publication Time Distribution</CardTitle>
              <CardDescription>
                Number of articles published in different time ranges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={timeData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeRange" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
