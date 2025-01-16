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
    <div className="border border-solid border-secondary rounded-sm min-w-[180px]">
      <Card className={cn(className)}>{children}</Card>
    </div>
  );
}
