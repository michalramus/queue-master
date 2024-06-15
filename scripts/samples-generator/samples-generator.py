import os 
import subprocess

path = "samples"
position_name = "position"
voice = "Zira" #To see all available voices run: balcon.exe -l

os.mkdir(path)

letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

for letter in letters:
    for number in range(1, 1000):
        f = open(f"in.txt", "w")
        f.write(f"{letter}{number}")
        f.close()
        subprocess.run(["balcon.exe", "-f", "in.txt", "-w", f"{path}\\{letter}{number}.wav", "-n", voice]) 

for i in range(1, 100):
    f = open(f"in.txt", "w")
    f.write(f"{position_name} {i}")
    f.close()
    subprocess.run(["balcon.exe", "-f", "in.txt", "-w", f"{path}\\POS{i}.wav", "-n", voice])
