export default async function handler(req, res) {
    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        const { prompt } = body;
        const apiKey = process.env.pukey;

        if (!apiKey) {
            return res.status(500).json({ error: "API Key 'pukey' is missing." });
        }

        // Use 1.5-flash for maximum stability with the v1beta endpoint
        const modelName = "gemini-1.5-flash";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                // Added safety settings so Eli's dark vibe doesn't trigger filters
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: "Google API Error: " + data.error.message });
        }

        // Return the whole object so your frontend can inspect candidates
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Crash: " + error.message });
    }
}


