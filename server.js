const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Foruddefinerede kode-snippets
const codeSnippets = {
    "blink led": `
// Blinker LED'erne på Micro:bit
basic.forever(function () {
    led.toggle(0, 0)
    basic.pause(1000)
})
    `,
    "måle temperatur": `
// Måler temperaturen på Micro:bit
basic.forever(function () {
    basic.showNumber(input.temperature())
    basic.pause(1000)
})
    `,
    "servo motor": `
// Styrer en servomotor med Micro:bit
basic.forever(function () {
    pins.servoWritePin(AnalogPin.P0, 90)
    basic.pause(1000)
    pins.servoWritePin(AnalogPin.P0, 0)
    basic.pause(1000)
})
    `
};

// Opsætning af OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for at håndtere brugerens spørgsmål
app.post('/ask', async (req, res) => {
    const question = req.body.question.toLowerCase();

    // Check for relevante kode-snippets
    for (const key in codeSnippets) {
        if (question.includes(key)) {
            return res.json({ answer: codeSnippets[key] });
        }
    }

    // Hvis ingen foruddefineret snippet findes, brug OpenAI
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Du er en assistent, der kun hjælper med programmering af Micro:bit i JavaScript. Hvis et spørgsmål ikke handler om dette, skal du venligt informere brugeren om, at du kun kan hjælpe med Micro:bit og JavaScript." },
                { role: "user", content: question },
            ],
            max_tokens: 150,
        });

        res.json({ answer: completion.choices[0].message.content.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Noget gik galt' });
    }
});

// Endpoint for kodeanalyse
app.post('/analyze', async (req, res) => {
    const code = req.body.code;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Du er en ekspert i Micro:bit-programmering. Analyser den indtastede kode og foreslå forbedringer eller fejlrettelser." },
                { role: "user", content: `Her er koden: ${code}` },
            ],
            max_tokens: 150,
        });

        res.json({ answer: completion.choices[0].message.content.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Noget gik galt' });
    }
});

// Start serveren
app.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
});
