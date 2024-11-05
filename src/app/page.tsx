"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const initialStory =
  "You awaken in a dark forest. A path leads north and a stream flows south. What do you do?";
const MAX_RESPONSES = 5; // Maximum number of AI responses before ending the story

export default function Component() {
  const [storyParts, setStoryParts] = useState([initialStory]);
  const [userInput, setUserInput] = useState("");
  const [responseCount, setResponseCount] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.trim() && !isEnded) {
      await continueStory(userInput);
    }
  };

  const continueStory = async (input: string) => {
    const newStoryPart = await fetchText(input);
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
    <div className="min-h-screen max-w-3xl mx-auto p-4 md:p-8 flex flex-col">
      <ScrollArea className="flex-grow mb-4 border rounded-lg p-4 bg-gray-100 dark:bg-gray-800">
        <div className="space-y-4">
          {storyParts.map((part, index) => (
            <p
              key={index}
              className={`text-sm md:text-lg font-medium font-mono ${
                part.startsWith(">") ? "text-blue-600 dark:text-blue-400" : ""
              }`}
            >
              {part}
            </p>
          ))}
        </div>
      </ScrollArea>
      <Card className="border-2 border-primary bg-background">
        <CardContent className="p-2">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent font-mono focus:outline-none text-foreground"
            autoFocus
            placeholder={isEnded ? "Story has ended" : "Enter your action..."}
            disabled={isEnded}
          />
        </CardContent>
      </Card>
      {isEnded && (
        <Button onClick={restartStory} className="mt-4">
          Restart Story
        </Button>
      )}
    </div>
  );
}
