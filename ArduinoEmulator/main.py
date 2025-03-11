import serial
import serial.tools.list_ports
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
import threading
import time

# Configuration initiale
serial_port = None
sensor_states = [False] * 6
led_states = [False] * 2

# Fonction pour envoyer un message série
def send_message(sensor_id):
    global serial_port
    if serial_port and serial_port.is_open:
        state = "ACTIVE" if not sensor_states[sensor_id] else "DESACTIVE"
        message = f"CAPTEUR_{sensor_id} {state}\n"
        serial_port.write(message.encode())
        sensor_states[sensor_id] = not sensor_states[sensor_id]
        sensor_buttons[sensor_id].config(text=f"Capteur {sensor_id}\n{state}")

# Fonction pour lire le port série en arrière-plan
def read_serial():
    global serial_port
    while True:
        if serial_port and serial_port.is_open and serial_port.in_waiting:
            data = serial_port.readline().decode().strip()
            log_text.insert("end", f"{data}\n")
            log_text.see("end")

            if "BOUEE_ON" in data:
                led_states[0] = True
            elif "BOUEE_OFF" in data:
                led_states[0] = False
            if "CAMION_ON" in data:
                led_states[1] = True
            elif "CAMION_OFF" in data:
                led_states[1] = False

            update_leds()
        time.sleep(0.1)

# Mise à jour des indicateurs LED
def update_leds():
    for i in range(2):
        color = "success" if led_states[i] else "danger"
        led_labels[i].config(bootstyle=color)

# Fonction pour ouvrir le port série
def open_serial():
    global serial_port
    selected_port = port_var.get()
    try:
        serial_port = serial.Serial(selected_port, 9600, timeout=1)
        status_label.config(text=f"Connecté à {selected_port}", bootstyle="success")
    except Exception as e:
        status_label.config(text=f"Erreur: {str(e)}", bootstyle="danger")

# Interface Graphique Tkinter avec ttkbootstrap
root = ttk.Window(themename="darkly")  # Thème moderne
root.title("Simulation Arduino - Capteurs & LEDs")
root.geometry("500x550")

# Sélection du port série
port_var = ttk.StringVar()
ports = [port.device for port in serial.tools.list_ports.comports()]
port_dropdown = ttk.Combobox(root, textvariable=port_var, values=ports, state="readonly", bootstyle="primary")
port_dropdown.pack(pady=10)

connect_button = ttk.Button(root, text="Connecter", command=open_serial, bootstyle="success")
connect_button.pack(pady=5)

status_label = ttk.Label(root, text="Port non connecté", bootstyle="danger")
status_label.pack(pady=5)

# Boutons pour les capteurs
sensor_frame = ttk.Frame(root)
sensor_frame.pack(pady=10)
sensor_buttons = []

for i in range(6):
    btn = ttk.Button(sensor_frame, text=f"Capteur {i}\n DESACTIVE", command=lambda i=i: send_message(i), bootstyle="info-outline")
    btn.grid(row=i//3, column=i%3, padx=10, pady=5, sticky="ew")
    sensor_buttons.append(btn)

# Affichage des logs (scrollable)
log_frame = ttk.Frame(root)
log_frame.pack(pady=10, fill="both", expand=True)

log_text = ttk.Text(log_frame, height=8, wrap="word", state="normal", font=("Arial", 10))
log_text.pack(fill="both", expand=True)

# Indicateurs LED stylisés
led_frame = ttk.Frame(root)
led_frame.pack(pady=10)

led_labels = []
for i in range(2):
    led = ttk.Label(led_frame, text=f"LED {i}", bootstyle="danger", font=("Arial", 12, "bold"), padding=10)
    led.pack(side="left", padx=20)
    led_labels.append(led)

# Lancer la lecture série en arrière-plan
threading.Thread(target=read_serial, daemon=True).start()

root.mainloop()
