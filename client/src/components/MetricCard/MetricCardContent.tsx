import React from "react";
import { CardContent } from "../ui/card";

interface MetricCardContentProps {
  value: string;
}

export default function MetricCardContent({
  children,
}: React.PropsWithChildren) {
  return <CardContent>{children}</CardContent>;
}
