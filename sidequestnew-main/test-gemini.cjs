require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
    try {
        const key = process.env.GEMINI_API_KEY;
        console.log("Using key starting with:", key ? key.substring(0, 8) : "UNDEFINED");

        if (!key) {
            console.error("GEMINI_API_KEY is missing in env!");
            return;
        }

        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Say hello world");
        console.log("Success:", result.response.text());
    } catch (err) {
        console.error("Gemini Error:", err.message);
    }
}
run();
