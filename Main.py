import os
import subprocess
import shutil
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox

# Funções existentes
def scan_folder(input_folder):
    return list(Path(input_folder).glob('*.*'))

def extract_category(filename):
    categories = ["A4", "A3", "Bottons", "Adesivos"]
    for category in categories:
        if category in filename:
            return category
    return "Outros"

def extract_unit_count(filename):
    try:
        return int(filename.split('_')[-1].split('.')[0])
    except (ValueError, IndexError):
        return 1

def organize_files(files, output_folder):
    for file in files:
        unit_count = extract_unit_count(file.name)
        category = extract_category(file.name)

        quantity_folder = output_folder / f'{unit_count} unidades'
        quantity_folder.mkdir(exist_ok=True)

        category_folder = quantity_folder / category
        category_folder.mkdir(exist_ok=True)

        shutil.move(str(file), str(category_folder))

def create_output_folder(output_folder):
    Path(output_folder).mkdir(parents=True, exist_ok=True)

def execute_indesign_script(input_folder, output_folder):
    # Caminho para o script JavaScript do InDesign e do executável
    if not indesign_script_path or not indesign_path:
        messagebox.showwarning("Atenção", "Por favor, selecione os caminhos do script e do executável do InDesign.")
        return

    # Comando para executar o script
    command = [
        indesign_path,
        "-run",
        indesign_script_path
    ]

    try:
        # Executa o comando
        subprocess.run(command, check=True)
        print("Script do InDesign executado com sucesso!")
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar o script do InDesign: {e}")

def clean_folders(input_folder, output_folder):
    for item in Path(input_folder).iterdir():
        if item.is_dir() and item != output_folder:
            shutil.rmtree(item)

# Função para executar as etapas principais
def execute_process():
    if not input_folder or not output_folder:
        messagebox.showwarning("Atenção", "Por favor, selecione pastas de entrada e saída.")
        return

    files = scan_folder(input_folder)
    create_output_folder(output_folder)
    organize_files(files, output_folder)
    execute_indesign_script(input_folder, output_folder)
    clean_folders(input_folder, output_folder)

    messagebox.showinfo("Sucesso", "Processo concluído com sucesso!")

# Interface Gráfica com Tkinter
def select_input_folder():
    global input_folder
    input_folder = Path(filedialog.askdirectory(title="Selecione a Pasta de Entrada"))
    input_label.config(text=f"Entrada: {input_folder}")

def select_output_folder():
    global output_folder
    output_folder = Path(filedialog.askdirectory(title="Selecione a Pasta de Saída"))
    output_label.config(text=f"Saída: {output_folder}")

def select_script_path():
    global indesign_script_path
    indesign_script_path = filedialog.askopenfilename(title="Selecione o Script do InDesign", filetypes=[("JavaScript Files", "*.jsx;*.js")])
    script_label.config(text=f"Script: {indesign_script_path}")

def select_exe_path():
    global indesign_path
    indesign_path = filedialog.askopenfilename(title="Selecione o Executável do Adobe InDesign", filetypes=[("Executável", "*.exe")])
    exe_label.config(text=f"InDesign Executável: {indesign_path}")

# Inicialização da janela principal
root = tk.Tk()
root.title("Organizador de Arquivos")
root.geometry("640x400")  # Aumenta a altura para acomodar mais elementos

input_folder = None
output_folder = None
indesign_script_path = None
indesign_path = None

# Layout da interface gráfica
frame = tk.Frame(root, padx=10, pady=10)
frame.pack()

input_label = tk.Label(frame, text="Entrada: Não selecionada")
input_label.pack(pady=5)

input_button = tk.Button(frame, text="Selecionar Pasta de Entrada", command=select_input_folder)
input_button.pack(pady=5)

output_label = tk.Label(frame, text="Saída: Não selecionada")
output_label.pack(pady=5)

output_button = tk.Button(frame, text="Selecionar Pasta de Saída", command=select_output_folder)
output_button.pack(pady=5)

script_label = tk.Label(frame, text="Script: Não selecionado")
script_label.pack(pady=5)

script_button = tk.Button(frame, text="Selecionar Script do InDesign", command=select_script_path)
script_button.pack(pady=5)

exe_label = tk.Label(frame, text="InDesign Executável: Não selecionado")
exe_label.pack(pady=5)

exe_button = tk.Button(frame, text="Selecionar Executável do Adobe InDesign", command=select_exe_path)
exe_button.pack(pady=5)

execute_button = tk.Button(frame, text="Executar", command=execute_process)
execute_button.pack(pady=20)

# Iniciar o loop da interface gráfica
root.mainloop()
