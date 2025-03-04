import processing.sound.*;

class Etat25 extends State {
  SoundFile file;

  Etat25(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
  }

  void onEnter() {
    serialHandler.sendCommand("BOUEE_OFF");
  }

  void update() {
    background(200, 200, 255);
    fill(0);
    textSize(32);
    text("Écran 2.5 - Tu as réservé la sargasse tu peux y aller", 100, 100);

    // Si capteur 3 activé -> passe à état 4
    if (serialHandler.isActivated(2)) {
      stateMachine.setState(new Etat3(stateMachine, serialHandler, apiHandler,p));
    }
  }
}
