export default function handler(req, res) {
    // I fixed the missing comma from your original file
    const inventory = [
        {
            file: "rant_02.html",
            title: "The Beauty of Unraveling",
            date: "2026-02-14",
            desc: "Reflects on decay, impermanence, and why deterioration feels more honest than anything polished."
        },
        {
            file: "rant_01.html",
            title: "Anti-Performative Identity",
            date: "2026-02-14",
            desc: "Most people are acting. Few are conscious of it."
        }
    ];

    // This sends the data to your website
    res.status(200).json(inventory);
}
