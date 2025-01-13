import React from "react";
import { Github, Twitter, Linkedin, ChartArea } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
  >
    {children}
  </a>
);

const SocialIcon = ({
  href,
  icon: Icon,
}: {
  href: string;
  icon: React.ElementType;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    <Icon className="h-5 w-5" />
  </a>
);

export function Footer() {
  return (
    <footer className="bg-background border-t left-0 bottom-0 relative">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="text-sm text-muted-foreground flex space-x-3 items-center">
            <span>Github Analytics</span>
            <ChartArea />
          </div>
          <div className="flex space-x-4">
            <SocialIcon
              href="https://github.com/guilhermec-costa/github-analytics/"
              icon={Github}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
