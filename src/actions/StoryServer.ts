"use server";
import { cookies } from "next/headers";

const MAX_RESPONSES = 7;

export async function generateStartingSentence({
  sentence,
}: {
  sentence: string;
}) {
  const prompt = `Generate a starting sentence for a text RPG story of any genre such as adventure, action, fantasy or horror. Max length should be around 250 characteres only and maintain a human tone, simple english only. The sentence should encourage exploration and interaction, making the player feel immediately involved. End the sentence with, 'What do you do?' use the following sentence as a prompt: ${sentence}`;
  try {
    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching text:", error);
    return "An error occurred. Please try again. What do you do?";
  }
}

export async function fetchImage(imageDescription: string): Promise<string> {
  try {
    const response = await fetch(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(
        `Generate a high-contrast, black-and-white image in a gritty, noir comic style. Illustrate the scene as described in ${imageDescription}, using bold, thick lines, heavy shadows, and minimal shading.`
      )}?width=1280&height=720&nologo=true`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.url;
  } catch (error) {
    console.error("Error fetching image:", error);
    return "An error occurred while generating image. Please try again.";
  }
}

export async function fetchText(
  userInput: string,
  storyParts: string[]
): Promise<string> {
  try {
    const context = storyParts.join("\n");
    const responseCount = storyParts.length / 2;
    const remainingResponses = MAX_RESPONSES - responseCount;
    const prompt = `Story so far:\n${context}\n\nUser: ${userInput}\n\nContinue the story based on the user's action. Be concise. Output only in one or two sentences only and maintain a human tone and simple english only .This is response ${
      responseCount + 1
    } out of ${MAX_RESPONSES}. ${
      remainingResponses <= 2 ? "Start wrapping up the story." : ""
    } ${
      remainingResponses <= 1
        ? "This should be the final response. End the story."
        : "End with 'What do you do?'"
    }`;

    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
      {
        cache: "no-store",
      }
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
}

export async function getStoryState() {
  const cookieStore = cookies();
  const storyParts = JSON.parse(cookieStore.get("storyParts")?.value || "[]");
  const imageUrl = cookieStore.get("imageUrl")?.value || "";
  const isEnded = cookieStore.get("isEnded")?.value === "true";
  return { storyParts, imageUrl, isEnded };
}

export async function setStoryState(
  storyParts: string[],
  imageUrl: string,
  isEnded: boolean
) {
  const cookieStore = cookies();
  cookieStore.set("storyParts", JSON.stringify(storyParts));
  cookieStore.set("imageUrl", imageUrl);
  cookieStore.set("isEnded", isEnded.toString());
}

export async function emptyStoryState() {
  const cookieStore = cookies();
  cookieStore.set("storyParts", JSON.stringify([]));
  cookieStore.set("imageUrl", "");
  cookieStore.set("isEnded", "false");
}
