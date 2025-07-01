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
import { getAiOverview } from "@/services/aiOverview.service";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

const AiOverview = () => {
  const [aiOverviews, setAiOverviews] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAiOverview();
        if (!ignore && response?.data) {
          setAiOverviews(response?.data);
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
      <ul className="flex flex-col gap-3">
        {Array(5)
          .fill(null)
          .map((_, key) => (
            <li key={key}>
              <Skeleton className="w-full h-40 bg-slate-200 dark:bg-slate-700" />
            </li>
          ))}
      </ul>
    );
  } else if (!loading && error) {
    content = (
      <Alert variant="destructive">
        <Terminal />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  } else {
    content = (
      <ul className="flex flex-col gap-3">
        {Object.entries(aiOverviews).map(([key, value]) => (
          <li key={key}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <Markdown>{value.toString()}</Markdown>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card className="flex flex-col flex-grow border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">AI overview</CardTitle>
        <CardDescription className="text-sm">
          Detailed emotion breakdown across all posts and comments
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">{content}</CardContent>
    </Card>
  );
};
export default AiOverview;
