"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchText, setStoryState } from "../actions/StoryServer";
import { BackHomeBtn } from "./BackHomeBtn";
import { LoaderCircle } from "lucide-react";
import { fetchImage } from "@/lib/utils";

export const UserInput = ({
  storyParts,
  isEnded,
}: {
  storyParts: string[];
  isEnded: boolean;
}) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEnded, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.trim() && !isEnded && !loading) {
      setLoading(true);
      const newStoryPart = await fetchText(userInput, storyParts);
      const imageUrl = await fetchImage(newStoryPart);
      const newStoryParts = [...storyParts, `> ${userInput}`, newStoryPart];
      const newIsEnded =
        newStoryParts.length / 2 >= 5 ||
        newStoryPart.toLowerCase().includes("the end");
      await setStoryState(newStoryParts, imageUrl, newIsEnded);
      setUserInput("");
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="w-full relative">
        <input
          type="text"
          value={userInput}
          ref={inputRef}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`w-full bg-transparent border-2 border-primary p-2 focus:outline-none text-2xl ${
            loading ? "cursor-not-allowed animate-pulse border-white " : ""
          }`}
          placeholder={isEnded ? "Story has ended" : "Enter your action..."}
          disabled={isEnded || loading}
          autoFocus={true}
        />
        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
      </div>
      {isEnded && <BackHomeBtn text="Start a new story" />}
    </div>
  );
};
