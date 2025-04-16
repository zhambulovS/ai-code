
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TagStats {
  tag: string;
  count: number;
}

interface TagStatsChartProps {
  tagStats: TagStats[];
}

export function TagStatsChart({ tagStats }: TagStatsChartProps) {
  // Sort tags by count (descending)
  const sortedTags = [...tagStats].sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Problem Tags Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedTags}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="tag" 
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value} problems`, 'Solved']}
                labelFormatter={(label) => `Tag: ${label}`}
              />
              <Bar 
                dataKey="count" 
                fill="#9b87f5" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
