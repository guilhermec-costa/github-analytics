import { Card, CardContent } from "@/components/ui/card";
import LanguageAcrossRepoDashboard from "./components/LanguageAcrossRepoDashboard";
import { MetricUnit } from "@/utils/types";

export default function LanguageSection({
  metric,
  dimension,
}: {
  metric: MetricUnit;
  dimension: string;
}) {
  return (
    <Card>
      <CardContent>
        <LanguageAcrossRepoDashboard metric={metric} dimension={dimension} />
      </CardContent>
    </Card>
  );
}
