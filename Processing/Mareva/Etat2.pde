class Etat2 extends State {
  int sargasseId = -1;

  Etat2(StateMachine sm, SerialHandler sh, ApiHandler ah) {
    super(sm, sh, ah);
  }

  void onEnter() {
    serialHandler.sendCommand("BOUEE_ON");
    sargasseId = apiHandler.postDetection(2, 1); // Ajoute une sargasse
  }

  void update() {
    background(200, 255, 200);
    fill(0);
    textSize(32);
    text("Écran 2 - Détection par la bouée, le pêcheur reçoit l'alerte", 100, 100);

    int currentTime = millis();
  if (currentTime - lastRequestTime > 500) {
      lastRequestTime = currentTime;
    // Si capteur 2 activé -> passe à état 3
      if (!apiHandler.checkPecheur(sargasseId)) {
        stateMachine.setState(new Etat25(stateMachine, serialHandler, apiHandler));
      }
    }
  }
  
}
