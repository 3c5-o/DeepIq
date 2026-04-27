const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 🔑 ضع التوكن هنا
const HF_TOKEN = "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";
const API_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL = "deepseek-ai/DeepSeek-V4-Pro:novita";

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HF_TOKEN}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    ...history,
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        res.json({ 
            success: true, 
            response: data.choices[0].message.content 
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
    console.log(`📱 افتح المتصفح على هذا العنوان`);
});
