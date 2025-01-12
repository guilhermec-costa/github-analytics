import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RepositoriesMetricsError() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        There was an error loading the repository metrics. Please try again
        later.
      </AlertDescription>
    </Alert>
  );
}
