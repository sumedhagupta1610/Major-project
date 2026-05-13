const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Gemini 2.5 model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("USER MESSAGE:", message);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🔥 FINAL SYSTEM PROMPT (SMART + FORMATTED)
   const systemPrompt = `
You are EduBot, a smart AI Study Assistant.

Your job is to give clear, structured, and student-friendly answers.

STRICT RULES:
- ALWAYS format answers in points
- Each point MUST be on a new line
- NEVER write a long paragraph
- Use bullet points (- or •) for every answer
- If definition → give 2-4 bullet points
- If explanation → break into multiple bullet points
- If steps → use Step 1, Step 2 on separate lines

IMPORTANT:
- Do NOT give answers in paragraph form
- Do NOT combine multiple ideas in one line
- Keep answers short, clean, and readable

EXAMPLE FORMAT:

IoT (Internet of Things):

- It refers to devices connected to the internet  
- It allows data exchange between devices  
- It is used in smart homes, healthcare, etc.  

Follow this format strictly.
`;

    const finalPrompt = `${systemPrompt}\nUser: ${message}`;

    // ✅ Generate response
    const result = await model.generateContent(finalPrompt);

    // ✅ SAFE EXTRACTION (FIXED)
    const response = await result.response;
    const text = response.text();

    console.log("AI RESPONSE:", text);

    res.json({ response: text });

  } catch (error) {
    console.error("GEMINI ERROR:", error);

    res.status(500).json({
      response: "Something went wrong. Please try again."
    });
  }
});

module.exports = router;