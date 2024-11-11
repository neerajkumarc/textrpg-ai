export const StoryText = ({ storyParts }: { storyParts: string[] }) => {
  return (
    <p className="space-y-4 py-4 text-2xl">
      {storyParts.length > 0
        ? storyParts[storyParts.length - 1]
        : "Start your story..."}
    </p>
  );
};
