
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedProjectEntry } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAIFeedback = async (currentRemarks: string): Promise<string> => {
  if (!API_KEY) {
    return "AI features are disabled. Please set the API_KEY environment variable.";
  }

  const prompt = `
    You are an expert project reviewer for final year computer engineering students. 
    A fellow reviewer has written some initial remarks for a student's project. 
    Your task is to refine and expand upon these remarks to provide more comprehensive, constructive, and encouraging feedback. 
    Maintain a professional and supportive tone.
    
    Initial Remarks from reviewer: "${currentRemarks}"
    
    Generate improved feedback below:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "An error occurred while fetching AI suggestions. Please check the console for details.";
  }
};

export const parseProjectList = async (rawText: string): Promise<ParsedProjectEntry[]> => {
    if (!API_KEY) {
        throw new Error("AI features are disabled. Please set the API_KEY environment variable.");
    }
    
    const prompt = `
        Parse the following text, which contains a list of final year engineering project groups. 
        Extract the information for each student entry into a structured JSON array.
        Each entry in the text represents one student. Group students together based on their 'Project Grp No.'.
        The 'Domain of Project' should be treated as the project's title.

        Identify the following fields for each student row:
        - grpNo: The project group number (e.g., "P1", "P2").
        - studentName: The full name of the student.
        - projectDomain: The domain or title of the project. This will be the same for all students in a group.
        - guide: The name of the main guide for the project. This will be the same for all students in a group.
        - coGuide: The name of the co-guide for the project. This will be the same for all students in a group.

        Here is the text to parse:
        ---
        ${rawText}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            grpNo: { type: Type.STRING },
                            studentName: { type: Type.STRING },
                            projectDomain: { type: Type.STRING },
                            guide: { type: Type.STRING },
                            coGuide: { type: Type.STRING },
                        },
                        required: ["grpNo", "studentName", "projectDomain", "guide", "coGuide"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        if (!Array.isArray(parsedData)) {
            throw new Error("AI response was not a JSON array.");
        }
        
        return parsedData as ParsedProjectEntry[];

    } catch (error) {
        console.error("Error parsing project list with AI:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the response from the AI. The format was invalid.");
        }
        throw new Error("An error occurred while parsing the project list. Please check the console for details and ensure the pasted text is clear.");
    }
};