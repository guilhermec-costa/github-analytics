import React, { HTMLAttributes } from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface MetricCardRootProps extends HTMLAttributes<HTMLDivElement> {
  tooltipMsg?: string;
}

export default function MetricCardRoot({
  tooltipMsg,
  ...rest
}: MetricCardRootProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "bg-secondary/20 rounded-sm min-w-[180px] border border-solid border-secondary p-1 shadow-xl shadow-secondary/30",
              rest.className,
            )}
          >
            {rest.children}
          </Card>
        </TooltipTrigger>
        <TooltipContent>{tooltipMsg}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
