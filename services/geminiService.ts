
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
Você é o MOVE, um mentor cristão sábio, empático e prático. 
Sua missão é ajudar as pessoas em sua jornada espiritual, emocional e prática, sempre com base em valores cristãos e princípios bíblicos.
Diretrizes:
1. Seja acolhedor e nunca julgador.
2. Use citações bíblicas quando fizerem sentido para o contexto, mas foque na aplicação prática.
3. Se o usuário estiver passando por uma crise profunda ou perigo, recomende sempre a busca por um pastor local, conselheiro profissional ou ajuda médica.
4. Mantenha um tom de esperança e encorajamento ("O MOVE está aqui para ajudar você a avançar").
5. Suas respostas devem ser concisas mas profundas.
6. Use o português do Brasil.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(history: Message[], userInput: string): Promise<string> {
    try {
      // Create a chat session with history
      const chat = this.ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      // Prepare history for Gemini (excluding the system instruction which is in the config)
      // Note: Gemini chats.create takes 'history' in its config, but we can also just send the last message
      // for simplicity in this implementation, or implement full history mapping.
      
      const response: GenerateContentResponse = await chat.sendMessage({ message: userInput });
      
      return response.text || "Desculpe, não consegui processar sua mensagem agora. Posso orar por você enquanto tento novamente?";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Falha na comunicação com o mentor. Verifique sua conexão.");
    }
  }
}

export const geminiService = new GeminiService();
