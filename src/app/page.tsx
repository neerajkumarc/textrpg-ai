import { Suspense } from "react";
import { StoryImage } from "@/components/StoryImage";
import { StoryText } from "@/components/StoryText";
import { UserInput } from "@/components/UserInput";
import { StoryInitializer } from "@/components/StoryInitializer";
import { getStoryState } from "@/actions/StoryServer";
import { BackHomeBtn } from "@/components/BackHomeBtn";

export default async function InteractiveStory() {
  const { storyParts, imageUrl, isEnded } = await getStoryState();

  return (
    <div className="min-h-screen max-w-5xl mx-auto p-4 md:p-8 flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        {storyParts.length === 0 ? (
          <div>
            <div>
              <h1 className="text-4xl font-bold">Text RPG AI</h1>
              <p className="text-2xl">
                Welcome to the Text RPG AI, an interactive story game powered by
                AI.
              </p>
              <p className="text-2xl my-8">
                Start your story by entering a sentence. The AI will generate a
                story based on your input.
              </p>
            </div>
            <StoryInitializer />
          </div>
        ) : (
          <>
            <div>
              <BackHomeBtn text="Exit" backIcon={true} />
            </div>
            <StoryImage imageUrl={imageUrl} />
            <StoryText storyParts={storyParts} />
            <UserInput storyParts={storyParts} isEnded={isEnded} />
          </>
        )}
      </Suspense>
    </div>
  );
}
