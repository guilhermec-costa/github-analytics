import React from "react";
import { CardHeader, CardTitle } from "../ui/card";

interface MetricCardHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export default function MetricCardHeader({
  icon,
  title,
}: MetricCardHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
  );
}
