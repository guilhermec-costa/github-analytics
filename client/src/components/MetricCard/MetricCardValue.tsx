import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface MetricCardValueProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export default function MetricCardValue({
  value,
  ...rest
}: MetricCardValueProps) {
  return (
    <div className={cn("text-2xl font-bold", rest.className)}>{value}</div>
  );
}
