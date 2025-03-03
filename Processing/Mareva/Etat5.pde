class Etat5 extends State {
  Etat5(StateMachine sm, SerialHandler sh, ApiHandler ah) {
    super(sm, sh, ah);
  }

  void onEnter() {
    serialHandler.sendCommand("CAMION_OFF");
    println("Fin de l'expérience...");
    delay(3000);
    exit();
  }

  void update() {
    background(100, 100, 100);
    fill(255);
    textSize(32);
    text("Écran 5 - Fin de l’expérience", 100, 100);
  }
}
