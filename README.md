## Smart TTS with Cohere, LangChain, and ElevenLabs API

This repository contains a Jupyter Notebook that leverages the LangChain library to obtain responses from Cohere's language models. Based on the configuration set with your API keys, it intelligently determines which Text-to-Speech (TTS) service to use (either Google's `gTTS` for simplicity or ElevenLabs' advanced API for more nuanced voice synthesis). The notebook supports both Hebrew and English text input.

### Developed by Yuval Avidani
Please credit and cite this project if you use or reference it!

#### Connect with me:
- **Yuval Avidani** on Platform X (@yuvalav)
- [My AI Communities and Content](https://linktr.ee/yuvai)

![Yuval's Image](https://s3-prod-ue1-images.s3.amazonaws.com/image_studio/generated/bee1043327044956920a08330536a2fe.webp?AWSAccessKeyId=AKIAQDJRGGOPGCRKJ35P&Signature=z%2Byo%2BR8Rwo0L%2BHWi08wVeDk5etI%3D&Expires=1800919805)

### How to Use This Notebook
1. **Run Cell 1, move to cell 2, replace TYPE_YOUR_COHERE_API_KEY_HERE with your actual Cohere API Key (you can get one for free on their website, this is mandatory!)**
2. **Enter your prompt in cell 3** and execute it to generate the input text.
3. **Execute cell 4** to process the input through the TTS service and listen to the output.
4. To re-run, simply change the prompt in cell 3 and run cells 3 and 4 again as needed.

### Setting Up ElevenLabs API
To use the ElevenLabs voices, follow these steps:
1. Create an account on ElevenLabs' platform and obtain your API key.
2. Select or create a custom voice and note the associated voice ID.
3. Enter your API key and voice ID in the Jupyter Notebook:
   - Click the key icon on the upper left side of the sidebar.
   - Add your API key and voice ID as shown in the notebook cells.
   - Ensure you set the notebook to have access to these credentials.

### Requirements
Make sure to install all required libraries as specified in the notebook. You may need to install:
- `langchain`
- `cohere-python`
- `gtts`
- `requests`
