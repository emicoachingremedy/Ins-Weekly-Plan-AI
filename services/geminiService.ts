import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedDay, ContentGenerationResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePostContent = async (dayPlan: GeneratedDay): Promise<ContentGenerationResult> => {
  const ai = getClient();
  
  const prompt = `
    Act as a world-class social media strategist and copywriter.
    Create a detailed Instagram post for a brand based on the following plan:
    
    Theme: ${dayPlan.theme}
    Core Pillar (Messaging): ${dayPlan.part1}
    Engagement Ending: ${dayPlan.part2}
    Format: ${dayPlan.format}
    
    Please provide:
    1. A catchy, engaging caption that fits the theme and pillar.
    2. A visual description of what the ${dayPlan.format} should look like.
    3. A set of relevant hashtags (10-15).
    
    Make the tone professional yet approachable and high-energy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            visualDescription: { type: Type.STRING },
            hashtags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["caption", "visualDescription", "hashtags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ContentGenerationResult;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};