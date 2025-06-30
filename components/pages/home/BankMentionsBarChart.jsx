"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getBankMentions } from "@/services/strategicOverview.service";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BANK_LABELS = {
  prime_bank: "Prime Bank",
  eastern_bank: "Eastern Bank",
  brac_bank: "BRAC Bank",
  city_bank: "City Bank",
  dutch_bangla: "Dutch-Bangla Bank",
};

const COLORS = ["#3B82F6", "#6366F1", "#10B981", "#F59E0B", "#EF4444"];

export default function BankMentionsBarChart() {
  const [bankMentions, setBankMentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartData = Object.entries(bankMentions)
    .filter(([key]) => key && BANK_LABELS[key]) // filter out invalid keys
    .map(([key, value]) => ({
      name: BANK_LABELS[key],
      value: parseFloat(value),
    }));

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getBankMentions();
        if (!ignore && response?.data) {
          setBankMentions(response?.data);
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
    content = <Skeleton className="w-full aspect-square" />;
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
      <>
        <div style={{ marginBottom: 12, fontWeight: 500 }}>
          Total Banks Mentioned: {chartData.reduce((sum, item) => sum + item.value, 0)}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </>
    );
  }

  return content;
}
