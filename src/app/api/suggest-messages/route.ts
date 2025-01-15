import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const prompt = `Create a list of three open-ended and
  engaging questions formatted as a single string. Each
  question should be separated by '||'. These questions are
  for an anonymous social messaging platform, like Qooh.me,
  and should be suitable for a diverse audience. Avoid
  personal or sensitive topics, focusing instead on
  universal themes that encourage friendly interaction. For
  example, your output should be structured like this:
  'What's a hobby you've recently started? || If you could
  have dinner with any historical figure, who would it be? ||
  What's a simple thing that makes you happy?'. Ensure the
  questions are intriguing, foster curiosity, and
  contribute to a positive and welcoming conversational
  environment.`

async function fetchSuggestions(): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    return response.choices[0]?.message?.content || "No suggestions generated.";
  } catch (error: any) {
    console.error("Error fetching suggestions:", error);
    throw new Error("Failed to fetch suggestions");
  }
}

export async function POST() {
  try {
    const suggestions = await fetchSuggestions();
    return NextResponse.json(suggestions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}