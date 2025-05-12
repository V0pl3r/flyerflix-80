
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ChartCardProps {
  title: string;
  type: "line" | "bar";
  data: Array<any>;
  dataKeys: { key: string; color: string }[];
  xAxisKey: string;
  height?: number;
}

const ChartCard = ({
  title,
  type,
  data,
  dataKeys,
  xAxisKey,
  height = 300,
}: ChartCardProps) => {
  return (
    <Card className="bg-[#222222] border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            primary: { theme: { light: "#ea384c", dark: "#ea384c" } },
            secondary: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
            tertiary: { theme: { light: "#10b981", dark: "#10b981" } },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height={height}>
            {type === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey={xAxisKey}
                  stroke="#8A898C"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#8A898C"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ stroke: "#8A898C" }}
                />
                {dataKeys.map((dk, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={dk.key}
                    stroke={dk.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey={xAxisKey}
                  stroke="#8A898C"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#8A898C"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.2)" }}
                />
                {dataKeys.map((dk, index) => (
                  <Bar
                    key={index}
                    dataKey={dk.key}
                    fill={dk.color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
