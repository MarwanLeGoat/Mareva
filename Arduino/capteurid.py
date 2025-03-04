import serial
import time
import sys
import requests
import json

url="http://localhost/api/detection"

data={"BoueeId":2,"TailleEstimee":1}
sid=0

screenState = 0  # On démarre à l'écran 1

# Pseudocode pour l'affichage
def afficherEcran(etat):
    if etat == 1:
        print("==== Écran 1 - Mise en situation ====")
    elif etat == 2:
        print("==== Écran 2 - Détection par la bouée ====")
    elif etat == 3:
        print("==== Écran 3 - Le pêcheur reçoit l’alerte ====")
    elif etat == 4:
        print("==== Écran 4 - Transformation des sargasses ====")
    elif etat == 5:
        print("==== Écran 5 - Fin de l’expérience ====")

PORT = "COM4"
BAUDRATE = 9600

def actualizeSensor(dicoEtats, capteur, etat):
    dicoEtats[capteur] = etat


try:
    ser = serial.Serial(PORT, BAUDRATE, timeout=1)
    time.sleep(2)
    afficherEcran(screenState)
    
    dicoEtats = {}

    while True:
        # Lire les événements capteurs
        while ser.in_waiting > 0:
            ligne = ser.readline().decode().strip()
            if ligne:
                print(f"[Arduino] {ligne}")  # debug
                # ligne = "Capteur_1 ACTIVE" par ex
                parts = ligne.split()
                if len(parts) == 2:
                    capteur, etat = parts  # ex: capteur="Capteur_1", etat="ACTIVE"
                    # Extraire l'index

                    indexStr = capteur.split("_")[1]  # "1"
                    indexCapteur = int(indexStr)

                    dicoEtats[indexCapteur] = etat
                    

                    # Etat initial
                    if screenState == 0 :
                        #On attend que toutes les pièces soient bine placées
                        if dicoEtats.get(0)=="ACTIVE" and dicoEtats.get(4) == "ACTIVE" and dicoEtats.get(3) =="ACTIVE":
                            screenState = 1
                            print("==== Écran 0 - Mise en situation ====")
                    

                    # Logique de changement d'écran
                    # Écran 1 -> 2 => si (screenState=1 ET capteur=0 ACTIVE)
                    if screenState == 1 and dicoEtats.get(1)=="ACTIVE":
                        screenState = 2
                        afficherEcran(screenState)
                        # Ex: allumer la LED_BOUÉE
                        ser.write(b"BOUEE_ON\n")
                        #on va effectuer une reqûete Post pour ajouter la sargasse au niveau de la bouée
                        response=requests.post(url,json=data)
                        print(response)
                        sid=response.json()["sargasseId"]
                        print(sid)
                        
                        
                    # Écran 2 -> 3 => si (screenState=2 ET capteur=1 ACTIVE)
                    if screenState == 2 and dicoEtats.get(2)=="ACTIVE" :
                        response=requests.get(url+"/"+str(sid))
                        peche=response.json()["detection"]["PecheurNom"]
                        if not peche:
                            screenState = 3
                            afficherEcran(screenState)
                            # on éteint la bouée peut-être, c’est toi qui décide
                            ser.write(b"BOUEE_OFF\n")

                    # Écran 3 -> 4 => si (screenState=3 ET capteur=3 ACTIVE)
                    if screenState == 3 and dicoEtats.get(3)=="ACTIVE":
                        screenState = 4
                        afficherEcran(screenState)
                        # allumer LED du camion ? 
                        ser.write(b"CAMION_ON\n")

                    # Écran 4 -> 5 => si (screenState=4 ET capteur=5 ACTIVE)
                    if screenState == 4 and dicoEtats.get(5) == "ACTIVE":
                        screenState = 5
                        afficherEcran(screenState)
                        # on peut éteindre la LED camion si tu veux
                        ser.write(b"CAMION_OFF\n")

                    # screenState=5 => fin de l'expérience
                    # tu peux décider d'arrêter le programme python
                    if screenState == 5:
                        print("Fin de l'expérience...")
                        sys.exit(0)

except serial.SerialException as e:
    print(f"Erreur série : {e}")

except KeyboardInterrupt:
    print("Interruption clavier...")

finally:
    if 'ser' in locals() and ser.is_open:
        ser.close()
        print("Port série fermé.")
