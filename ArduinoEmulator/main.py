import serial
import serial.tools.list_ports
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
import threading
import time

# Configuration initiale
serial_port = None
sensor_states = [False] * 6 # Etat des capteurs
led_states = [False] * 2  # Etat des LEDs
token_positions = [0, 1, 0]  # Positions initiales des jetons sur les chemins (0: début, 1: fin)
#         Capteurs 0, 3, 4


# Fonction pour envoyer le changement d'état d'un capteur
def send_message(sensor_id, state):
    global serial_port
    if (serial_port and serial_port.is_open):
        txtState = "ACTIVE" if state else "DESACTIVE"
        message = f"CAPTEUR_{sensor_id} {txtState}\n"
        serial_port.write(message.encode())

# Fonction pour lire le port série en arrière-plan
def read_serial():
    global serial_port
    while True:
        if (serial_port and serial_port.is_open and serial_port.in_waiting):
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


# Fonction pour mettre à jour l'état d'un capteur
def update_sensor_state(sensor_id, state):
    send_message(sensor_id, state) if sensor_states[sensor_id] != state else None
    sensor_states[sensor_id] = state
    sensor_buttons[sensor_id].config(text=f"Capteur {sensor_id}\nACTIVE" if state else f"Capteur {sensor_id}\nDESACTIVE", bootstyle="success" if state else "info-outline")
    slider_labels[sensor_id].config(bootstyle="success" if state else "info")


# Mise à jour des LEDs
def update_leds():
    for i in range(2):
        color = "success" if led_states[i] else "danger"
        led_labels[i].config(bootstyle=color)


# Fonction pour déplacer un jeton sur un chemin
def move_token(path_id, position):
    global token_positions


    start_sensor = path_id * 2
    end_sensor = start_sensor + 1

    # Mettre à jour la position du jeton et les états des capteurs
    if position == 0:
        new_position = start_sensor
        update_sensor_state(end_sensor, False)
        update_sensor_state(start_sensor, True)
    elif position == 1:
        new_position = end_sensor
        update_sensor_state(start_sensor, False)
        update_sensor_state(end_sensor, True)
    else:
        new_position = None
        update_sensor_state(start_sensor, False)
        update_sensor_state(end_sensor, False)

    slider = sliders[path_id]
    slider.config(bootstyle="success" if new_position is not None else "info")


# Fonction pour ouvrir le port série
def open_serial():
    global serial_port
    selected_port = port_var.get()
    try:
        serial_port = serial.Serial(selected_port, 9600, timeout=1)
        status_label.config(text=f"Connecté à {selected_port}", bootstyle="success")
    except Exception as e:
        status_label.config(text=f"Erreur: {str(e)}", bootstyle="danger")



# Interface Graphique 
root = ttk.Window(themename="darkly")  # Thème moderne
root.title("Simulation Arduino - Capteurs & LEDs")
root.geometry("500x700")

# Sélection du port série
port_var = ttk.StringVar()
ports = [port.device for port in serial.tools.list_ports.comports()]
port_dropdown = ttk.Combobox(root, textvariable=port_var, values=ports, state="readonly", bootstyle="primary")
port_dropdown.pack(pady=10)

connect_button = ttk.Button(root, text="Connecter", command=open_serial, bootstyle="success")
connect_button.pack(pady=5)

status_label = ttk.Label(root, text="Port non connecté", bootstyle="danger")
status_label.pack(pady=5)

# Boutons pour les capteurs (plutôt des Indicateurs au final)
sensor_frame = ttk.Frame(root)
sensor_frame.pack(pady=10)
sensor_buttons = []

for i in range(6):
    btn = ttk.Button(sensor_frame, text=f"Capteur {i}\n DESACTIVE", command=lambda i=i: send_message(i, None), bootstyle="info-outline")
    btn.grid(row=i//3, column=i%3, padx=10, pady=5, sticky="ew")
    sensor_buttons.append(btn)


# Sliders pour déplacer les jetons
token_frame = ttk.Frame(root)
token_frame.pack(pady=10)

slider_labels = []
sliders = []

for i in range(3):
    slider_frame = ttk.Frame(token_frame)
    slider_frame.pack(pady=5, fill="x")

    label_start = ttk.Label(slider_frame, text=f"Capteur {i*2}", bootstyle="info")
    label_start.pack(side="left", padx=10)
    slider_labels.append(label_start)

    slider = ttk.Scale(slider_frame, from_=0, to=1, orient="horizontal", command=lambda val, i=i: move_token(i, (float(val))), bootstyle="primary")
    slider.pack(side="left", fill="x", expand=True, padx=10)
    sliders.append(slider)

    label_end = ttk.Label(slider_frame, text=f"Capteur {i*2+1}", bootstyle="info")
    label_end.pack(side="right", padx=10)
    slider_labels.append(label_end)

# Initialiser les sliders et leur position
def initialize_sliders():
    global token_positions
    for i in range(3):
        sliders[i].set(token_positions[i])
        move_token(i, token_positions[i])
root.after(100, initialize_sliders)


# Affichage des logs (reception des messages)
log_frame = ttk.Frame(root)
log_frame.pack(pady=10, fill="both", expand=True)

log_text = ttk.Text(log_frame, height=8, wrap="word", state="normal", font=("Arial", 10))
log_text.pack(fill="both", expand=True)


# Indicateurs LEDs
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

