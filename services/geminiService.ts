
import { GoogleGenAI } from "@google/genai";

export async function getExamInfo(examName: string): Promise<string> {
  if (!examName) {
    return "";
  }
  
  if (!process.env.API_KEY) {
      return "A chave de API do Gemini não foi configurada. Não é possível buscar informações.";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `Forneça uma explicação concisa sobre o exame laboratorial "${examName}", para que serve, e quais são os valores de referência para adultos. A resposta deve ser em português do Brasil. Formate a resposta em markdown. Sempre cite as fontes no final.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text ?? "Não foi possível obter informações sobre este exame.";
  } catch (error) {
    console.error("Error fetching exam info from Gemini API:", error);
    return "Ocorreu um erro ao buscar informações sobre o exame. Verifique sua chave de API e a conexão com a internet.";
  }
}
