"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmojiGrid, { EmojiData } from "@/components/EmojiGrid";
import { useEmojiStore } from "@/store/emojiStore";


export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { emojis, setEmojis } = useEmojiStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-emoji", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.emoji) && data.emoji.length > 0) {
        const newEmoji: EmojiData = { url: data.emoji[0], likes: 0, isLiked: false };
        const updatedEmojis = [...emojis, newEmoji];
        setEmojis(updatedEmojis);
      } else {
        console.error("Failed to generate emoji:", data.error || "Unexpected response format");
      }
    } catch (error) {
      console.error("Error generating emoji:", error);
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <span role="img" aria-label="Emoji">🤔</span> Emoji maker
      </h1>
      
      <div className="w-full max-w-xl mb-8">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            type="text" 
            placeholder="Enter a prompt to generate an emoji" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </form>
      </div>

      <EmojiGrid />
    </div>
  );
}
