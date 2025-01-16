import { cn } from "@/lib/utils";
import { LanguageIconMap } from "@/utils/LanguageIconMap";
import { HTMLAttributes } from "react";

interface ProgrammingLanguageIconProps extends HTMLAttributes<HTMLDivElement> {
  lang: string;
}

export default function ProgrammingLanguageIcon({
  lang,
  ...rest
}: ProgrammingLanguageIconProps) {
  return (
    <i className={cn(LanguageIconMap[lang.toLowerCase()], rest.className)}></i>
  );
}
