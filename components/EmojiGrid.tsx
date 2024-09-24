"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Download, Heart } from "lucide-react";
import { useEmojiStore } from "@/store/emojiStore";

export interface EmojiData {
  url: string;
  likes: number;
  isLiked: boolean;
}

export default function EmojiGrid() {
  const { emojis, updateEmoji } = useEmojiStore();

  const handleDownload = (url: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "emoji.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error("Error downloading image:", error));
  };

  const handleLike = (index: number) => {
    const emoji = emojis[index];
    updateEmoji(index, {
      likes: emoji.isLiked ? emoji.likes - 1 : emoji.likes + 1,
      isLiked: !emoji.isLiked,
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {emojis.map((emoji, index) => (
        <Card key={index} className="p-2 relative group">
          <Image
            src={emoji.url}
            alt="Generated Emoji"
            width={100}
            height={100}
            className="w-full h-auto"
            unoptimized
            priority={index < 4}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="p-2 bg-white rounded-full mr-2"
              onClick={() => handleDownload(emoji.url)}
            >
              <Download size={20} />
            </button>
            <button 
              className="p-2 bg-white rounded-full flex items-center"
              onClick={() => handleLike(index)}
            >
              <Heart size={20} fill={emoji.isLiked ? "red" : "none"} color={emoji.isLiked ? "red" : "black"} />
              <span className="ml-1 text-xs">{emoji.likes}</span>
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}