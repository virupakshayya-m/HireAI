import dotenv from "dotenv";
dotenv.config(); // Force load keys locally within this module

import { GoogleGenAI, Type } from "@google/genai";
import AppError from "../utils/AppError.js";

// Initialize the Google Gen AI SDK
// It automatically picks up GEMINI_API_KEY from the environment
const ai = new GoogleGenAI({});

export const evaluateCandidate = async (resumeText, skills, jobDescription) => {
  try {
    const prompt = `
      You are an expert technical recruiter and AI matching engine.
      Your task is to evaluate a candidate's profile against a job description.

      Candidate Skills: ${skills.join(", ") || "None provided"}
      Candidate Resume Text: ${resumeText || "None provided"}
      
      Job Description: ${jobDescription}

      Evaluate the candidate strictly based on how well their skills and resume match the job description.
      Provide a comprehensive JSON response containing:
      - matchScore: A number from 0 to 100 representing how good of a match they are.
      - strengths: An array of strings highlighting their strong points for this job.
      - weaknesses: An array of strings highlighting their weak points or lack of experience.
      - missingSkills: An array of skills mentioned in the job description that the candidate is missing.
      - summary: A 2-3 sentence summary of your evaluation.
      - interviewQuestions: An array of 3 specific technical or behavioral questions to ask this candidate based on their profile and the job.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: {
              type: Type.NUMBER,
              description: "Match score from 0 to 100",
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            summary: { type: Type.STRING },
            interviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "matchScore",
            "strengths",
            "weaknesses",
            "missingSkills",
            "summary",
            "interviewQuestions",
          ],
        },
      },
    });

    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error("AI Evaluation Error:", error);
    // If the AI fails, we don't want to block the application entirely.
    // We can return a default fallback object.
    return {
      matchScore: 0,
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      summary: "AI evaluation failed or is temporarily unavailable.",
      interviewQuestions: [],
    };
  }
};
