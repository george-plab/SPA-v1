import { GoogleGenAI, Type } from "@google/genai";
import { RecipeCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to ensure the model behaves as a Mediterranean chef
const SYSTEM_INSTRUCTION = `Eres un chef experto en dieta mediterránea. 
Tu objetivo es generar recetas auténticas, saludables y deliciosas en español.
Debes devolver siempre los datos en un formato JSON estricto según el esquema proporcionado.`;

export const generateRecipes = async (): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Genera una lista de 15 recetas de dieta mediterránea: 5 primeros platos, 5 segundos platos y 5 postres.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    enum: ["primero", "segundo", "postre"] 
                  },
                  summary: { type: Type.STRING },
                  fullDescription: { type: Type.STRING },
                  ingredients: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  steps: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  }
                },
                required: ["id", "title", "category", "summary", "fullDescription", "ingredients", "steps"]
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      // Map and add random initial ratings so the UI looks populated
      return (parsed.recipes || []).map((recipe: any) => ({
        ...recipe,
        rating: Number((4 + Math.random()).toFixed(1)), // Random rating between 4.0 and 5.0
        votes: Math.floor(Math.random() * 50) + 10 // Random votes between 10 and 60
      }));
    }
    return [];
  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
};

export const generateRecipeImage = async (recipeTitle: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Una fotografía profesional de alta resolución, estilo fotografía de comida, de: ${recipeTitle}. Iluminación natural, dieta mediterránea, emplatado elegante.`,
            },
          ],
        },
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
      return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}