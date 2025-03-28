import processing.sound.*;

class Etat3 extends State {
  SoundFile file;
  PImage img;

  Etat3(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("Etat3.png");
    file = new SoundFile(p, "soft-bell.mp3");
    file.play();

  }

  void onEnter() {
    serialHandler.sendCommand("BOUEE_OFF");
    apiHandler.deleteSargasse();
    serialHandler.sendCommand("CAMION_OFF");

  }

  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);

    // Si capteur 3 activé -> passe à état 4
    if (serialHandler.isActivated(3)) {
      stateMachine.setState(new Etat4(stateMachine, serialHandler, apiHandler,p));
    }
    if (!serialHandler.isActivated(4)) {
     stateMachine.setState(new ErrorStateCamion(stateMachine, serialHandler, apiHandler,p, this));
    }
  }
}
