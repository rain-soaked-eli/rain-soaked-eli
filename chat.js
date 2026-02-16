export default async function handler(req, res) {
    // 1. LOGGING: This will force text to appear in your Vercel Logs
    console.log("--- CHAT FUNCTION STARTED ---");

    try {
        // 2. THE FIX: Handle the data safely (String vs Object)
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        const { prompt } = body;

        // Log the prompt so you know it arrived
        console.log("Received Prompt:", prompt); 

        // 3. CHECK API KEY
        const apiKey = process.env.pukey;
        if (!apiKey) {
            console.error("CRITICAL ERROR: 'pukey' is missing!");
            return res.status(500).json({ error: "API Key 'pukey' is missing from Vercel settings." });
        }

        // 4. CALL GOOGLE
        console.log("Calling Gemini API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 5. CHECK FOR GOOGLE ERRORS
        if (data.error) {
            console.error("Gemini Error:", data.error.message);
            return res.status(500).json({ error: "Gemini Refused: " + data.error.message });
        }

        console.log("Success! Sending reply.");
        res.status(200).json(data);

    } catch (error) {
        console.error("CRASH:", error);
        res.status(500).json({ error: "Server Crash: " + error.message });
    }
}