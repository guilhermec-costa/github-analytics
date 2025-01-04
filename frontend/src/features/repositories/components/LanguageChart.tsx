import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LanguageCount, MetricUnit } from "@/utils/types";
import { BarChart, XAxis, YAxis, Bar } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function LanguageChart({ metric }: { metric: MetricUnit }) {
  console.log(metric);
  return (
    <div className="w-full md:w-2/3 lg:w-2/3 p-4 bg-card rounded-lg shadow-xl">
      <ChartContainer config={chartConfig} className="w-full">
        <BarChart
          data={metric.LanguageDetails}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          barSize={20}
          className="transition-all"
        >
          <XAxis type="number" dataKey={"count"} hide />
          <YAxis
            type="category"
            dataKey={"language"}
            tickLine={false}
            tickMargin={10}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="var(--color-desktop)"
            radius={10}
            fontSize={13}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
