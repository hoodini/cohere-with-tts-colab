const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

const COHERE_API_KEY = 'DWbCt3SFbRWNv3hsMo150ZXQQAakr7dTiDf56Iwx';
const ELEVENLABS_API_KEY = 'c87393b046adcc0378818a11d2e2e4f1';
const ELEVENLABS_VOICE_ID = 'pxg2GegTcg7iZ6yMxi1N';

app.post('/generate', async (req, res) => {
  const { text, voiceModel } = req.body;
  try {
    // Call Cohere API to generate text
    const cohereResponse = await axios.post('https://api.cohere.ai/generate', {
      model: 'xlarge',
      prompt: text,
      max_tokens: 50,
      temperature: 0.5,
    }, {
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`
      }
    });

    let audioUrl = '';

    // Determine which TTS service to use based on voiceModel
    if (voiceModel === 'elevenlabs') {
      // Call ElevenLabs API to synthesize speech
      const elevenLabsResponse = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        text: cohereResponse.data.text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }, {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ELEVENLABS_API_KEY}`
        }
      });
      audioUrl = elevenLabsResponse.data.url;
    } else if (voiceModel === 'roboshaul') {
      // Placeholder for Robo-Shaul API call
      // Since the server lacks GPU support, we cannot directly run the model here.
      // We would need to set up a separate service that has GPU support and call it here.
      // For now, we will return a placeholder response.
      audioUrl = 'https://placeholder.url/for/roboshaul/audio';
    }

    // Respond with generated text and audio URL
    res.json({
      text: cohereResponse.data.text,
      audioUrl: audioUrl
    });
  } catch (error) {
    if (error.response) {
      console.error('Error generating text or synthesizing speech:', error);
    }
    if (error.response && error.response.data) {
      res.status(500).json({ message: 'Error generating text or synthesizing speech', error: error.response.data });
    } else {
      res.status(500).json({ message: 'Error generating text or synthesizing speech', error: error.message });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
