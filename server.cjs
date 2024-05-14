const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ text: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error generating content:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
