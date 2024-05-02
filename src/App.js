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

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    // Call Cohere API to generate text
    try {
      const cohereResponse = await axios.post('https://api.cohere.ai/generate', {
        model: "command",
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
            'xi-api-key': 'c87393b046adcc0378818a11d2e2e4f1'
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
