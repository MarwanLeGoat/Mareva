import processing.sound.*;

class Etat1 extends State {
  SoundFile file;
  PImage img;
  Etat1(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("Etat1.png");
    file = new SoundFile(p, "soft-bell.mp3");
    file.play();
    }
      
  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);
    if (serialHandler.isActivated(1)) {
      stateMachine.setState(new Etat2(stateMachine, serialHandler, apiHandler,p));
    }
    if (!serialHandler.isActivated(3)) {
     stateMachine.setState(new ErrorStateBateau(stateMachine, serialHandler, apiHandler,p, this));
    }
    if (!serialHandler.isActivated(4)) {
     stateMachine.setState(new ErrorStateCamion(stateMachine, serialHandler, apiHandler,p, this));
    }
  }
}
