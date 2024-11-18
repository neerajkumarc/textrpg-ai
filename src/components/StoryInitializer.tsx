"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  generateStartingSentence,
  setStoryState,
} from "../actions/StoryServer";
import { LoaderCircle } from "lucide-react";
import { fetchImage } from "@/lib/utils";

export const StoryInitializer = () => {
  const [initialStory, setInitialStory] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInitialize = async () => {
    setLoading(true);
    if (initialStory.trim()) {
      const sentence = await generateStartingSentence({
        sentence: initialStory,
      });
      const imageUrl = await fetchImage(sentence);
      await setStoryState([sentence], imageUrl, false);
      router.refresh();
    }
    setLoading(false);
  };

  const handleSuggestionClick = () => {
    setInitialStory(
      "You wake up in a forest, with no memory of how you got there and a mysterious map in your hand."
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 my-4">
        <p
          className="p-4 border rounded-md cursor-pointer hover:scale-105 transition-all"
          onClick={handleSuggestionClick}
        >
          You wake up in a forest, with no memory of how you got there and a
          mysterious map in your hand.
        </p>
        <p
          className="p-4 border rounded-md cursor-pointer hover:scale-105 transition-all"
          onClick={handleSuggestionClick}
        >
          The donut shop owner hands you a pastry and whispers, 'This holds the
          key to everything.
        </p>
      </div>

      <form className="space-y-4">
        <input
          type="text"
          value={initialStory}
          onChange={(e) => setInitialStory(e.target.value)}
          className="w-full p-2 border-2 border-primary bg-background text-foreground text-2xl"
          placeholder="Enter the starting sentence of your story..."
          disabled={loading}
          autoFocus={true}
        />

        <Button
          onClick={handleInitialize}
          className="w-full text-2xl p-6 flex items-center gap-2"
          disabled={loading}
          type="button"
        >
          {loading ? (
            <>
              {" "}
              Generating Scene
              <LoaderCircle className="animate-spin" />
            </>
          ) : (
            <>Start Story</>
          )}
        </Button>
      </form>
    </>
  );
};
