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
      const cohereModel = detectedLanguage === 'he' ? 'cohere-he' : 'cohere-en';
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
            Yuval Avidani is the creator of this web app, which utilizes the Cohere API for text generation and the ElevenLabs API for text-to-speech functionality. This app is designed to showcase the capabilities of these APIs and provide a user-friendly interface for text synthesis and speech generation.
          </Text>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
