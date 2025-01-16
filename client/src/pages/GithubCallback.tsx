import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GithubCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await AuthService.authUsingRouteLocation(location);
        if (response) {
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);
          toast({
            title: "Authentication Successful",
            description: "You have been successfully logged in.",
            duration: 3000,
          });
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Authentication Failed",
          description: "There was an error logging you in. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
        navigate("/login");
      }
    };

    fetchAuth();
  }, [location, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <Card className="w-[350px] h-[200px] flex items-center justify-center">
        <CardContent>
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              Authenticating
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please wait while we log you in...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
