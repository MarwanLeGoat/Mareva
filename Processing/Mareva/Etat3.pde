class Etat3 extends State {
  Etat3(StateMachine sm, SerialHandler sh, ApiHandler ah) {
    super(sm, sh, ah);
  }

  void onEnter() {
    serialHandler.sendCommand("BOUEE_OFF");
  }

  void update() {
    background(200, 200, 255);
    fill(0);
    textSize(32);
    text("Écran 3 - Tu as récupère la sargasse", 100, 100);

    // Si capteur 3 activé -> passe à état 4
    if (serialHandler.isActivated(3)) {
      stateMachine.setState(new Etat4(stateMachine, serialHandler, apiHandler));
    }
  }
}
