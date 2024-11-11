"use client";

import { emptyStoryState } from "@/actions/StoryServer";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const BackHomeBtn = ({
  text,
  backIcon,
}: {
  text: string;
  backIcon?: boolean;
}) => {
  const router = useRouter();
  return (
    <Button
      className="text-2xl p-6 my-8"
      onClick={() => {
        emptyStoryState();
        router.refresh();
      }}
    >
      {backIcon && <ArrowLeft className="mr-2" />}
      {text}
    </Button>
  );
};
