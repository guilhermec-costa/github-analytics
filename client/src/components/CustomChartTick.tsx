import { CheckCircle } from "lucide-react";
import { LanguageIconMap } from "@/utils/LanguageIconMap";

const CustomTick = (props: any) => {
  const { index, x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={x} y={y}>
        data
      </text>
    </g>
  );
};
