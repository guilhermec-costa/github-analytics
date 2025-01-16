import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface MetricCardRootProps {
  children: React.ReactNode;
  className?: string;
}

export default function MetricCardRoot({
  children,
  className,
}: MetricCardRootProps) {
  return (
    <Card
      className={cn(
        "bg-secondary/20 rounded-sm min-w-[180px] border border-solid border-secondary p-1 shadow-md shadow-secondary/20",
        className,
      )}
    >
      {children}
    </Card>
  );
}
