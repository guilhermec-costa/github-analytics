import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LanguageCount, MetricUnit } from "@/utils/types";
import { Area, AreaChart, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function CommitChart({ metric }: { metric: MetricUnit }) {
  console.log(metric.CommitDetails);
  return (
    <div className="w-full md:w-2/3 lg:w-2/3 p-4 bg-card rounded-lg shadow-xl">
      <ChartContainer config={chartConfig} className="w-full">
        <LineChart data={metric.CommitDetails}>
          <XAxis type="category" dataKey={"date"} />
          <YAxis type="number" dataKey={"commits"} />
          <Line
            type="monotone"
            dataKey="commits"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
