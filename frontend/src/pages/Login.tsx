import { Github } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-200 to-slate-400">
      <Card className="w-full sm:w-[400px] shadow-xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="text-center p-8">
          <CardTitle className="text-2xl font-bold text-gray-800">
            GitHub Analytics Dashboard
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Sign in to access your analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}`}
            className="w-full flex justify-center items-center gap-4 bg-black text-white p-3 rounded-xl font-semibold hover:bg-opacity-80 transition-all ease-in-out duration-300 shadow-lg transform hover:scale-105"
          >
            <Github className="text-white text-2xl" />
            <span>Sign in with GitHub</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
