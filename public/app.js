async function sendQuestion() {
    const userInput = document.getElementById('userInput').value;
    const responseElement = document.getElementById('response');

    if (!userInput) {
        alert("Skriv venligst dit spørgsmål.");
        return;
    }

    responseElement.textContent = "Genererer kode...";

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: userInput }),
        });
        const data = await response.json();
        responseElement.textContent = data.answer;
    } catch (error) {
        responseElement.textContent = "Der opstod en fejl. Prøv igen senere.";
    }
}

async function analyzeCode() {
    const userCode = document.getElementById('userCode').value;
    const responseElement = document.getElementById('response');

    if (!userCode) {
        alert("Indsæt venligst din kode til analyse.");
        return;
    }

    responseElement.textContent = "Analyserer kode...";

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: userCode }),
        });
        const data = await response.json();
        responseElement.textContent = data.answer;
    } catch (error) {
        responseElement.textContent = "Der opstod en fejl. Prøv igen senere.";
    }
}
