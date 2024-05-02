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

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
