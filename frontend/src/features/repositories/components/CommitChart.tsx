import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { LanguageCount } from "@/utils/types";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function CommitChart({
  selectedRepository,
}: {
  selectedRepository: LanguageCount[];
}) {
  return (
    <div className="w-full md:w-2/3 lg:w-1/2 p-4 bg-card rounded-lg shadow-xl">
      <ChartContainer config={chartConfig} className="w-full">
        <AreaChart data={selectedRepository}>
          <XAxis type="category" dataKey={"language"} />
          <YAxis type="number" dataKey={"count"} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
