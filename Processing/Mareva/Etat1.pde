import processing.sound.*;

class Etat1 extends State {
  SoundFile file;
  Etat1(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
  }
  
  void update() {
    background(255, 200, 200);
    fill(0);
    textSize(32);
    text("Écran 1 - Mise en situation", 100, 100);

    // Si les capteurs 0, 3 et 4 sont activés -> passe à l’état 2
    if (serialHandler.isActivated(0) && serialHandler.isActivated(3) && serialHandler.isActivated(4)) {
      stateMachine.setState(new Etat2(stateMachine, serialHandler, apiHandler,p));
    }
  }
}
