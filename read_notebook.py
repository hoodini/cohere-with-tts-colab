import nbformat

def read_notebook(notebook_path):
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = nbformat.read(f, as_version=4)
        for cell in nb.cells:
            if cell.cell_type == 'code':
                print(f'Cell {nb.cells.index(cell)}: {cell.source}\n\n')

if __name__ == '__main__':
    notebook_path = 'Robo_Shaul_Colab.ipynb'
    read_notebook(notebook_path)

