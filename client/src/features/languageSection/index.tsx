import { Card, CardContent } from "@/components/ui/card";
import LanguageAcrossRepoDashboard from "./components/LanguageAcrossRepoDashboard";
import { MetricUnit } from "@/utils/types";

export default function LanguageSection({ metric }: { metric: MetricUnit }) {
  return (
    <Card>
      <CardContent>
        <LanguageAcrossRepoDashboard metric={metric} />
      </CardContent>
    </Card>
  );
}
