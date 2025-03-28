import processing.sound.*;

class Etat25 extends State {
  SoundFile file;
  PImage img;

  Etat25(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("Etat5.png");
    serialHandler.sendCommand("CAMION_ON");
    file = new SoundFile(p, "soft-bell.mp3");
    file.play();

  }

  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);

    // Si capteur 3 activé -> passe à état 4
    if (serialHandler.isActivated(2)) {
      stateMachine.setState(new Etat3(stateMachine, serialHandler, apiHandler,p));
    }
    if (!serialHandler.isActivated(4)) {
     stateMachine.setState(new ErrorStateCamion(stateMachine, serialHandler, apiHandler,p, this));
    }
  }
}
