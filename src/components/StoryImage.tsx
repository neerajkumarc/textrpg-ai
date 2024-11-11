export const StoryImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div>
      <img
        src={imageUrl}
        alt="Story Image"
        className="w-full h-56 md:h-96 object-cover"
      />
    </div>
  );
};
