import { Github } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

export function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>GitHub Analytics Dashboard</CardTitle>
          <CardDescription>Sign in to access your analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => console.log("hello")}></Button>
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GIT_HUB_CLIENT_ID}`}
            className="w-full flex justify-center gap-3 bg-black text-white p-2 rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
          >
            <Github />
            Sign in with GitHub
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
