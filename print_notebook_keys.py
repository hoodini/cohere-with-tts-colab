import json

# Load the notebook as a JSON object
notebook_path = "Robo_Shaul_Colab.ipynb"
with open(notebook_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

# Print the keys of the first cell to confirm structure
print("Keys of the first cell:", list(nb["cells"][0].keys()))
