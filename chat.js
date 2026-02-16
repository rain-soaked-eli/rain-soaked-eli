export default async function handler(req, res) {
    try {
        let body = req.body;
        if (typeof body === 'string') body = JSON.parse(body);
        const { prompt } = body;
        const apiKey = process.env.pukey;

        // CHANGED: Back to Flash, but using the "Latest" version tag to be safe
        const model = "gemini-1.5-flash-latest";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Error Handling
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
