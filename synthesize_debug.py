import traceback
import numpy as np
import sys
import torch
import os

# Add the tacotron2 and waveglow directories to the Python path to resolve the 'layers' and 'denoiser' modules
sys.path.append('tacotron2')
sys.path.append('waveglow')

from hparams import create_hparams
from model import Tacotron2
from layers import TacotronSTFT
from audio_processing import griffin_lim
from text import text_to_sequence
from denoiser import Denoiser  # Importing Denoiser

def synthesize_text(input_text):
    # Load pre-trained models and set up Tacotron2 and Waveglow
    hparams = create_hparams()
    hparams.sampling_rate = 22050
    model = Tacotron2(hparams)
    # Correcting the path to the pretrained model and ensuring it's loaded on CPU
    # Adding strict=False to ignore non-matching keys
    model.load_state_dict(torch.load('tacotron2/tacotron2_pretrained_model.pth', map_location=torch.device('cpu'))['state_dict'], strict=False)
    model.eval()
    # Correcting the path to the pretrained model and ensuring it's loaded on CPU
    waveglow = torch.load('waveglow/waveglow_pretrained_model.pth', map_location=torch.device('cpu'))['model']
    waveglow.eval()
    for k in waveglow.convinv:
        k.float()
    # Instantiating Denoiser without CUDA
    denoiser = Denoiser(waveglow).to(torch.device('cpu'))

    # Prepare text input for synthesis
    sequence = np.array(text_to_sequence(input_text, ['english_cleaners']))[None, :]
    sequence = torch.autograd.Variable(torch.from_numpy(sequence)).long()

    # Debug: Print the sequence to check if it's correctly formatted
    print("Sequence:", sequence)
    print("Sequence shape:", sequence.shape)
    print("Sequence dtype:", sequence.dtype)

    # Synthesize audio from text
    try:
        mel_outputs, mel_outputs_postnet, _, alignments = model.inference(sequence)
        # Debug: Print mel_outputs to check if they are generated correctly
        print("Mel Outputs:", mel_outputs)
        print("Mel Outputs Postnet:", mel_outputs_postnet)
        print("Alignments:", alignments)
    except Exception as e:
        print("Error during model inference:", e)
        traceback.print_exc()
        # Instead of returning None, raise the exception to be caught by the calling function
        raise e

    # Generate audio from mel spectrogram using WaveGlow
    try:
        audio = waveglow.infer(mel_outputs_postnet, sigma=0.6)
        # Debug: Print the generated audio to check if it's correct
        print("Generated Audio:", audio)
    except Exception as e:
        print("Error during audio generation:", e)
        traceback.print_exc()
        raise e

    # Apply denoiser to the generated audio
    try:
        audio_denoised = denoiser(audio, strength=0.01)[:, 0]
        # Debug: Print the denoised audio to check if it's correct
        print("Denoised Audio:", audio_denoised)
    except Exception as e:
        print("Error during audio denoising:", e)
        traceback.print_exc()
        raise e

    # Return the denoised audio
    return audio_denoised.cpu().numpy()

# Example usage
if __name__ == '__main__':
    input_text = sys.argv[1]
    audio = synthesize_text(input_text)
    # Output the audio to a file or stdout

print('Debug: Input sequence:', sequence)
try:
    mel_outputs, mel_outputs_postnet, _, alignments = model.inference(sequence)
    print('Debug: Model outputs:', mel_outputs, mel_outputs_postnet, alignments)
except Exception as e:
    print('Error during model inference:', e)
    raise e
