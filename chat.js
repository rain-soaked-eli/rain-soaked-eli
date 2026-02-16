export default async function handler(req, res) {
    // 1. Get the prompt from your HTML
    const { prompt } = JSON.parse(req.body);

    // 2. Get the Secret Key from Vercel's brain
    const apiKey = process.env.pukey;

    // 3. Talk to Gemini for you
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();

    // 4. Send the answer back to your site
    res.status(200).json(data);
}