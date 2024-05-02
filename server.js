const express = require('express');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');

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
      model: 'command',
      prompt: text,
      max_tokens: 50,
      temperature: 0.5,
    }, {
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`
      }
    });

    let audioData = [];

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
      res.json({
        text: cohereResponse.data.text,
        audioUrl: elevenLabsResponse.data.url
      });
    } else if (voiceModel === 'roboshaul') {
      // Call the Python script to synthesize speech using Robo-Shaul model
      const pythonProcess = spawn('python3', ['./synthesize.py', text]);
      pythonProcess.stdout.on('data', (data) => {
        audioData.push(data);
      });
      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code !== 0) {
          return res.status(500).json({ message: 'Error synthesizing speech with Robo Shaul model' });
        }
        // Concatenate audio data and respond with generated text and audio
        const audioBuffer = Buffer.concat(audioData);
        res.json({
          text: cohereResponse.data.text,
          audio: audioBuffer.toString('base64')
        });
      });
    } else {
      // If no valid voice model is selected, return an error
      throw new Error('Invalid voice model selected');
    }
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
