import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const MODEL_NAME = "gemini-3-flash-preview";

export const analyzeResume = async (resumeText: string) => {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Analyze the following resume and provide a structured feedback in JSON format.
    Resume Text: ${resumeText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Overall score out of 100" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          atsOptimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "strengths", "weaknesses", "recommendations", "atsOptimizationTips"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateInterviewQuestion = async (role: string, transcript: any[]) => {
  const context = transcript.map(t => `${t.role.toUpperCase()}: ${t.content}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `You are an expert interviewer for the role of ${role}. 
    Based on the following conversation, ask the next relevant question. 
    Keep it professional and challenging.
    
    Transcript:
    ${context}
    
    INTERVIEWER:`,
  });

  return response.text || "Could you tell me more about your experience with complex problem solving?";
};

export const generateInterviewFeedback = async (role: string, transcript: any[]) => {
  const context = transcript.map(t => `${t.role.toUpperCase()}: ${t.content}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Evaluate this mock interview for the role of ${role}.
    Transcript:
    ${context}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          communicationScore: { type: Type.NUMBER },
          technicalScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          improvementAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["overallScore", "communicationScore", "technicalScore", "summary", "improvementAreas"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateRoadmap = async (targetRole: string, currentSkills: string[]) => {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Create a professional skill roadmap for someone wanting to become a ${targetRole}. 
    Current skills: ${currentSkills.join(', ')}.
    Include milestones with duration and resources.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
