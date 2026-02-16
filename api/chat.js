export default async function handler(req, res) {
    try {
        let body = req.body;
        if (typeof body === 'string') body = JSON.parse(body);
        const { prompt } = body;
        const apiKey = process.env.pukey;

        // --- CHANGE THIS LINE TO SWAP MODELS ---
        const modelName = "gemini-2.0-flash-exp"; 
        // ---------------------------------------

        console.log(`Using Model: ${modelName}`);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: `Model ${modelName} Failed: ` + data.error.message });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

