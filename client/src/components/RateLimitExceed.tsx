import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { rateLimitStorageKey } from "@/lib/http/BackendClient";

export default function RateLimitExceeded() {
  return localStorage.getItem(rateLimitStorageKey) ? (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Alert className="w-full max-w-md" variant="destructive">
        <AlertTitle>Rate Limit Exceeded</AlertTitle>
        <AlertDescription>
          You’ve hit the API rate limit. Please wait a few minutes before trying
          again.
        </AlertDescription>
      </Alert>
    </div>
  ) : (
    <></>
  );
}
