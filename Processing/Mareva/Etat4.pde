class Etat4 extends State {
  Etat4(StateMachine sm, SerialHandler sh, ApiHandler ah) {
    super(sm, sh, ah);
  }

  void onEnter() {
    serialHandler.sendCommand("CAMION_ON");
  }

  void update() {
    background(255, 200, 255);
    fill(0);
    textSize(32);
    text("Écran 4 - Transformation des sargasses", 100, 100);

    // Si capteur 5 activé -> passe à état 5
    if (serialHandler.isActivated(5)) {
      stateMachine.setState(new Etat5(stateMachine, serialHandler, apiHandler));
    }
  }
}
