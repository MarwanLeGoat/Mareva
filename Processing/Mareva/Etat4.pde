import processing.sound.*;

class Etat4 extends State {
  SoundFile file;

  Etat4(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
  }

  void onEnter() {
    serialHandler.sendCommand("CAMION_ON");
  }

  void update() {
    background(255, 200, 255);
    fill(0);
    textSize(32);
    text("Écran 4 - Il faut emmener les sargasses vers l'usine de traitement", 100, 100);

    // Si capteur 5 activé -> passe à état 5
    if (serialHandler.isActivated(5)) {
      stateMachine.setState(new Etat5(stateMachine, serialHandler, apiHandler,p));
    }
  }
}
