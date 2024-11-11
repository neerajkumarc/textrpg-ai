"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  generateStartingSentence,
  fetchImage,
  setStoryState,
} from "../actions/StoryServer";
import { LoaderCircle } from "lucide-react";

export const StoryInitializer = () => {
  const [initialStory, setInitialStory] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInitialize = async () => {
    setLoading(true);
    if (initialStory.trim()) {
      const imageUrl = await fetchImage(initialStory);
      const sentence = await generateStartingSentence({
        sentence: initialStory,
      });
      await setStoryState([sentence], imageUrl, false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4">
      <input
        type="text"
        value={initialStory}
        onChange={(e) => setInitialStory(e.target.value)}
        className="w-full p-2 border-2 border-primary bg-background text-foreground text-2xl"
        placeholder="Enter the starting sentence of your story..."
        disabled={loading}
      />
      <Button
        onClick={handleInitialize}
        className="w-full text-2xl p-6 flex items-center gap-2"
        disabled={loading}
        type="submit"
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
  );
};
