import React, { useState } from "react";
import {
  ThemeProvider,
  CSSReset,
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  Spinner,
} from "@chakra-ui/react";
import AudioPlayer from "react-audio-player";
import { customTheme } from "./theme";
import axios from 'axios';

function App() {
  const [userInput, setUserInput] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en'); // Default language set to English

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const detectLanguage = (text) => {
    // Placeholder function for language detection
    // In a real-world scenario, this would use a language detection library or API
    if (/[\u0590-\u05FF]/.test(text)) {
      return 'he'; // Hebrew regex match
    }
    return 'en'; // Default to English
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const detectedLanguage = detectLanguage(userInput);
    setLanguage(detectedLanguage);
    // Call Cohere API to generate text
    try {
      const cohereModel = detectedLanguage === 'he' ? 'cohere-he' : 'cohere-2';
      const cohereResponse = await axios.post('https://api.cohere.ai/generate', {
        model: cohereModel,
        prompt: userInput,
        max_tokens: 50,
        temperature: 0.5,
      }, {
        headers: {
          'Authorization': `Bearer DWbCt3SFbRWNv3hsMo150ZXQQAakr7dTiDf56Iwx`
        }
      });

      if (cohereResponse.data && cohereResponse.data.text) {
        setGeneratedText(cohereResponse.data.text);
        // Call ElevenLabs API to synthesize speech
        const elevenLabsResponse = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/pxg2GegTcg7iZ6yMxi1N`, {
          text: cohereResponse.data.text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }, {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'Authorization': `Bearer c87393b046adcc0378818a11d2e2e4f1`
          },
          responseType: 'blob'
        });

        if (elevenLabsResponse.data) {
          // Create a URL for the audio blob
          const audioBlobUrl = URL.createObjectURL(elevenLabsResponse.data);
          setAudioUrl(audioBlobUrl);
        }
      }
    } catch (error) {
      console.error('Error during API calls:', error);
      setError('An error occurred while generating the text. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Box maxWidth="xl" p={4} m="auto" my={6}>
        <FormControl>
          <FormLabel htmlFor="user-input">Enter your text</FormLabel>
          <Textarea
            id="user-input"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type something..."
            size="sm"
          />
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Generating..."
        >
          Generate
        </Button>
        {error && (
          <Text color="red.500" mt={2}>
            {error}
          </Text>
        )}
        {generatedText && (
          <Box mt={4}>
            <Text mb={2}>Generated Text:</Text>
            <Text p={4} borderWidth={1} borderRadius={4}>
              {generatedText}
            </Text>
          </Box>
        )}
        {audioUrl && (
          <Box mt={4}>
            <Text mb={2}>Listen to the generated speech:</Text>
            <AudioPlayer
              src={audioUrl}
              controls
            />
          </Box>
        )}
        {isLoading && (
          <Spinner size="xl" />
        )}
        {/* About Section */}
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">About Yuval Avidani</Text>
          <Text mt={2}>
            Yuval Avidani is an innovative software engineer and the creator of this web app. With a passion for technology and a keen interest in language processing, Yuval has expertly integrated the Cohere API for text generation and the ElevenLabs API for text-to-speech functionality into this application. This app is a testament to Yuval's skills and dedication to providing user-friendly solutions that leverage cutting-edge technology. For more information about Yuval's work and projects, please visit [Yuval's Portfolio](https://yuval-avidani-portfolio.com).
          </Text>
          <Text mt={2}>
            Instructions for use: Enter your prompt to generate text, then process the input through the TTS service to listen to the output. To use ElevenLabs voices, obtain an API key and voice ID, and enter them in the provided fields.
          </Text>
          <Text mt={2}>
            If you use or reference this project, please credit and cite it!
          </Text>
          <Text mt={2}>
            Connect with me:
          </Text>
          <Text mt={2}>
            - Yuval Avidani on Platform X (@yuvalav)
          </Text>
          <Text mt={2}>
            - <a href="https://linktr.ee/yuvai" target="_blank" rel="noopener noreferrer">My AI Communities and Content</a>
          </Text>
          <Box mt={2} style={{ textAlign: 'center' }}>
            <img src="https://s3-prod-ue1-images.s3.amazonaws.com/image_studio/generated/bee1043327044956920a08330536a2fe.webp" alt="Yuval's Image" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
// Test comment for editing
