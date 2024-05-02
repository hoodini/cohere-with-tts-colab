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
    model.load_state_dict(torch.load('tacotron2/tacotron2_pretrained_model.pth', map_location=torch.device('cpu'))['state_dict'])
    model.eval()
    # Correcting the path to the pretrained model and ensuring it's loaded on CPU
    waveglow = torch.load('waveglow/waveglow_pretrained_model.pth', map_location=torch.device('cpu'))['model']
    waveglow.eval()
    for k in waveglow.convinv:
        k.float()
    denoiser = Denoiser(waveglow)  # Instantiating Denoiser

    # Prepare text input for synthesis
    sequence = np.array(text_to_sequence(input_text, ['english_cleaners']))[None, :]
    sequence = torch.autograd.Variable(torch.from_numpy(sequence)).long()

    # Synthesize audio from text
    mel_outputs, mel_outputs_postnet, _, alignments = model.inference(sequence)
    audio = waveglow.infer(mel_outputs_postnet, sigma=0.6)
    audio_denoised = denoiser(audio, strength=0.01)[:, 0]  # Applying Denoiser

    # Return the denoised audio
    return audio_denoised.cpu().numpy()

# Example usage
if __name__ == '__main__':
    input_text = sys.argv[1]
    audio = synthesize_text(input_text)
    # Output the audio to a file or stdout
