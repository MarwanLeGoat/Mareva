// - 2 LED (Bouée, Camion) qu'on pilotera depuis Arduino 
#define CAPTEUR_0 2
#define CAPTEUR_1 3
#define CAPTEUR_2 4
#define CAPTEUR_3 5
#define CAPTEUR_4 6
#define CAPTEUR_5 7

#define LED_BOUEE 8
#define LED_CAMION 9

int etatsPrecedents[6];

void setup() {
  Serial.begin(9600);
  pinMode(LED_BOUEE, OUTPUT);
  pinMode(LED_CAMION, OUTPUT);
  digitalWrite(LED_BOUEE, LOW);
  digitalWrite(LED_CAMION, LOW);

  for (int i = 0; i < 6; i++) {
    pinMode(i+2, INPUT);
    etatsPrecedents[i] = digitalRead(i+2);
  }
}

void loop() {
  // 1) Détecter les changements d'état
  for (int i = 0; i < 6; i++) {
    int nouvelEtat = digitalRead(i+2);
    if (nouvelEtat != etatsPrecedents[i]) {
      Serial.print("Capteur_");
      Serial.print(i);
      Serial.print(nouvelEtat == LOW ? " ACTIVE" : " DESACTIVE");
      Serial.println();
      etatsPrecedents[i] = nouvelEtat;
    }
  }

  if (Serial.available() > 0) {
    String commande = Serial.readStringUntil('\n');
    if (commande == "BOUEE_ON") {
      digitalWrite(LED_BOUEE, HIGH);
    } else if (commande == "BOUEE_OFF") {
      digitalWrite(LED_BOUEE, LOW);
    } else if (commande == "CAMION_ON") {
      digitalWrite(LED_CAMION, HIGH);
    } else if (commande == "CAMION_OFF") {
      digitalWrite(LED_CAMION, LOW);
    }
  }
}
