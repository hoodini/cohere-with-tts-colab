import json
import nbformat

# Load the notebook as a JSON object
notebook_path = 'Robo_Shaul_Colab.ipynb'
with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = nbformat.read(f, as_version=4)

# Initialize a variable to store the extracted code
extracted_code = ""

# Search for 'hparams' and other relevant code in the notebook cells
for cell in nb['cells']:
    # Check if the cell contains code
    if cell['cell_type'] == 'code':
        # Convert the list of strings to a single string
        cell_source_str = ''.join(cell['source'])
        # Diagnostic print to show the cell source
        print(f"Cell {nb['cells'].index(cell)} source:", cell_source_str)
        # Check if 'hparams' or 'import' is in the cell source
        if 'hparams' in cell_source_str or 'import' in cell_source_str:
            # Append the source of the relevant cell to the extracted code
            extracted_code += cell_source_str + "\n\n"

# Diagnostic print to confirm the extraction
print("Extracted code:", extracted_code)

# Save the extracted code to a .py file
with open('extracted_code.py', 'w', encoding='utf-8') as f:
    f.write(extracted_code)
