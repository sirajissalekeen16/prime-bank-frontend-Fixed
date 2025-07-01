"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getActionItems } from "@/services/actionItems.service";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";

const ActionItems = () => {
  const [actionItems, setActionItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getActionItems();
        if (!ignore && response?.data) {
          setActionItems(response?.data);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (!ignore) {
      fetchData();
    }

    return () => {
      ignore = true;
    };
  }, []);

  let content = null;

  if (loading) {
    content = (
      <tr>
        <td colSpan={11} className="text-center p-2 sm:p-3 whitespace-nowrap">
          <Skeleton className="w-full aspect-video bg-slate-200 dark:bg-slate-700" />
        </td>
      </tr>
    );
  } else if (!loading && error) {
    content = (
      <tr>
        <td colSpan={11} className="text-center p-2 sm:p-3 whitespace-nowrap">
          <Alert variant="destructive">
            <Terminal />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </td>
      </tr>
    );
  } else if (!loading && !error && actionItems?.length === 0) {
    content = (
      <tr>
        <td colSpan={11} className="text-center p-2 sm:p-3 whitespace-nowrap">
          No posts found!
        </td>
      </tr>
    );
  } else {
    content = actionItems.map((row, index) => (
      <tr
        key={index}
        className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
      >
        <td className="sticky left-0 bg-white dark:bg-slate-800 p-2 sm:p-3 border-r z-10 whitespace-nowrap">
          <div
            className="max-w-[20px] block sm:max-w-xs truncate font-bold"
            title={index}
          >
            {index}
          </div>
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap">
          <a
            href={row?.post_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="max-w-[120px] block cursor-pointer text-blue-500 font-bold truncate"
          >
            {row.text}
          </a>
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap capitalize">{row.type}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
          {row.share_count}
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
          {row.reaction_count}
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
          {row.comments_count}
        </td>
        <td className="p-2 sm:p-3 whitespace-nowrap">{row.sentiment}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap">{row.category}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap">{row.emotion}</td>
        <td className="p-2 sm:p-3 whitespace-nowrap text-center">
          {row.virality_score}
        </td>
      </tr>
    ));
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Action Items</CardTitle>
        <CardDescription className="text-sm">
          Recommended actions based on sentiment analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="mb-3 text-base sm:text-lg font-bold text-gray-500 dark:text-slate-100">
          Processed Posts Data
        </h1>
        <div className="relative">
          <div className="overflow-auto max-h-[50vh] sm:max-h-96 border rounded-lg">
            <table className="w-full text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700 z-10">
                <tr className="border-b">
                  <th className="sticky left-0 bg-slate-50 dark:bg-slate-700 p-2 sm:p-3 text-left font-medium border-r z-20 w-[20px] whitespace-nowrap"></th>
                  <th className="p-2 sm:p-3 text-left font-medium min-w-[100px] whitespace-nowrap">
                    Text
                  </th>
                  <th className="p-2 sm:p-3 font-medium min-w-[100px] whitespace-nowrap text-left">
                    Type
                  </th>
                  <th className="p-2 sm:p-3 font-medium min-w-[100px] whitespace-nowrap text-center">
                    Share Count
                  </th>
                  <th className="p-2 sm:p-3 text-center font-medium min-w-[60px] whitespace-nowrap">
                    Reaction Count
                  </th>
                  <th className="p-2 sm:p-3 text-center font-medium min-w-[100px] whitespace-nowrap">
                    Comment Count
                  </th>
                  <th className="p-2 sm:p-3 text-left font-medium min-w-[60px] whitespace-nowrap">
                    Sentiment
                  </th>
                  <th className="p-2 sm:p-3 text-left font-medium min-w-[80px] whitespace-nowrap">
                    Category
                  </th>
                  <th className="p-2 sm:p-3 text-left font-medium min-w-[80px] whitespace-nowrap">
                    Emotion
                  </th>
                  <th className="p-2 sm:p-3 text-center font-medium min-w-[80px] whitespace-nowrap">
                    Virality Score
                  </th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ActionItems;
