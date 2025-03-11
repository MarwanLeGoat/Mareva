import processing.sound.*;

class Etat0 extends State {
  SoundFile file;
  PImage img;
  Etat0(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("Etat1.png");
    file = new SoundFile(p, "soft-bell.mp3");
    file.play();
  }
      
  void update() {
    image(img,0,0,width,height);
    fill(0);
    if (serialHandler.isActivated(0) && serialHandler.isActivated(3) && serialHandler.isActivated(4)) {
      stateMachine.setState(new Etat1(stateMachine, serialHandler, apiHandler,p));
    }
  }
}
