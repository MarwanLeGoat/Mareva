import processing.sound.*;

class Etat3 extends State {
  SoundFile file;
  PImage img;

  Etat3(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("Etat4.png");

  }

  void onEnter() {
    serialHandler.sendCommand("BOUEE_OFF");
    apiHandler.deleteSargasse();
  }

  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);
    text("Écran 3 - Tu as récupère la sargasse", 100, 100);

    // Si capteur 3 activé -> passe à état 4
    if (serialHandler.isActivated(3)) {
      stateMachine.setState(new Etat4(stateMachine, serialHandler, apiHandler,p));
    }
  }
}
