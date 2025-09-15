"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SymbolSearchProps {
  locale: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function SymbolSearch({ 
  locale, 
  placeholder = "Symbol...", 
  defaultValue = "",
  className = "" 
}: SymbolSearchProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const router = useRouter();

  const handleSearch = () => {
    const symbol = searchTerm.trim().toUpperCase();
    if (symbol) {
      console.log('🔍 Searching for symbol:', symbol);
      router.push(`/${locale}/${symbol}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input 
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
      <Button 
        onClick={handleSearch}
        variant="outline"
        size="sm"
        className="px-4 py-2 text-sm"
      >
        Search
      </Button>
    </div>
  );
}