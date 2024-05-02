# hparams.py

def create_hparams():
    """Create hyperparameters configuration."""
    class HParams:
        def __init__(self):
            self.sampling_rate = 22050
            self.max_decoder_steps = 1800
            self.gate_threshold = 0.1

    return HParams()
