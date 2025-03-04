import processing.sound.*;

class Etat1 extends State {
  SoundFile file;
  PImage img;
  Etat1(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("Etat1.jpg");
    }
      
  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);
    text("Écran 1 - Mise en situation", 100, 100);
    if (serialHandler.isActivated(0) && serialHandler.isActivated(3) && serialHandler.isActivated(4)) {
      stateMachine.setState(new Etat2(stateMachine, serialHandler, apiHandler,p));
    }
  }
}
