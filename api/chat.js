export default async function handler(req, res) {
    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        const { prompt } = body;
        const apiKey = process.env.pukey;

        if (!apiKey) {
            return res.status(500).json({ error: "API Key 'pukey' is missing from Vercel." });
        }

        // STABLE 2.0 FLASH MODEL NAME
        const modelName = "gemini-2.0-flash";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: "Google API Error: " + data.error.message });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Crash: " + error.message });
    }
}
