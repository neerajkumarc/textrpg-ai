import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
