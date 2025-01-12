import React, { useRef } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface UserSearchInputProps {
  placeholder?: string;
  onSearch: (username: string) => void;
}

export default function SearchInput({
  placeholder,
  onSearch,
}: UserSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (!inputRef.current?.value.trim()) return;
    onSearch(inputRef.current.value);
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        className="relative"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        size={15}
        style={{ opacity: "50%" }}
      />
    </div>
  );
}
