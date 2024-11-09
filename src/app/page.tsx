"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const initialStory =
  "You awaken in a dark forest. A path leads north and a stream flows south. What do you do?";
const initialImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
  initialStory
)}?width=1280&height=720&nologo=true`;
const MAX_RESPONSES = 5; // Maximum number of AI responses before ending the story

export default function Component() {
  const [storyParts, setStoryParts] = useState([initialStory]);
  const [userInput, setUserInput] = useState("");
  const [responseCount, setResponseCount] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    setLoading(true);
    if (e.key === "Enter" && userInput.trim() && !isEnded) {
      await continueStory(userInput);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [storyParts]);

  const continueStory = async (input: string) => {
    const newStoryPart = await fetchText(input);
    const imageUrl = await fetchImage(newStoryPart);
    setImageUrl(imageUrl);
    setStoryParts((prev) => [...prev, `> ${input}`, newStoryPart]);
    setUserInput("");
    setResponseCount((prev) => prev + 1);
    if (
      responseCount + 1 >= MAX_RESPONSES ||
      newStoryPart.toLowerCase().includes("the end")
    ) {
      setIsEnded(true);
    }
  };

  const restartStory = () => {
    setStoryParts([initialStory]);
    setResponseCount(0);
    setIsEnded(false);
  };
  const fetchImage = async (imageDescription: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(
          imageDescription
        )}?width=1280&height=720&nologo=true`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.url;
      return data;
    } catch (error) {
      console.error("Error fetching text:", error);
      return "An error occurred while generating image. Please try again.";
    }
  };

  const fetchText = async (userInput: string): Promise<string> => {
    try {
      const context = storyParts.join("\n");
      const remainingResponses = MAX_RESPONSES - responseCount;
      const prompt = `Story so far:\n${context}\n\nUser: ${userInput}\n\nContinue the story based on the user's action. Be concise. Output only in one or two sentences only .This is response ${
        responseCount + 1
      } out of ${MAX_RESPONSES}. ${
        remainingResponses <= 2 ? "Start wrapping up the story." : ""
      } ${
        remainingResponses <= 1
          ? "This should be the final response. End the story."
          : "End with 'What do you do?'"
      }`;

      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      return remainingResponses <= 1
        ? data
        : data.endsWith("What do you do?")
        ? data
        : `${data} What do you do?`;
    } catch (error) {
      console.error("Error fetching text:", error);
      return "An error occurred. Please try again. What do you do?";
    }
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-4 md:p-8 flex flex-col">
      <div>
        <img
          src={imageUrl}
          alt="Image"
          className={`w-full h-56 md:h-96 object-cover  ${
            loading ? "animate-pulse" : ""
          }`}
        />
      </div>
      <p className="space-y-4 py-4 text-2xl">
        {storyParts.findLast((part) => ({ part }))}
      </p>
      <div className="border-2 border-primary bg-background">
        <div className="p-2">
          <input
            type="text"
            value={userInput}
            ref={inputRef}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent  focus:outline-none text-foreground text-2xl"
            autoFocus
            placeholder={isEnded ? "Story has ended" : "Enter your action..."}
            disabled={isEnded || loading}
          />
        </div>
      </div>
      {isEnded && (
        <Button onClick={restartStory} className="mt-4">
          Restart Story
        </Button>
      )}
    </div>
  );
}
