import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LanguageAcrossRepoDashboard from "./components/LanguageAcrossRepoDashboard";
import { MetricUnit } from "@/utils/types";
import { Separator } from "@/components/ui/separator";

interface LanguageSectionProps {
  metrics: MetricUnit[];
}

export default function LanguageSection({ metrics }: LanguageSectionProps) {
  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>Language Analysis</CardTitle>
        <CardDescription>
          Explore the distribution and usage of programming languages across
          your repositories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator />
        <LanguageAcrossRepoDashboard metrics={metrics} />
      </CardContent>
    </Card>
  );
}
