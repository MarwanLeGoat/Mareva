import processing.sound.*;

class Etat4 extends State {
  SoundFile file;
  PImage img;

  Etat4(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("Etat5.png");
    file = new SoundFile(p, "soft-bell.mp3");
    file.play();

  }

  void onEnter() {
  }

  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);

    // Si capteur 5 activé -> passe à état 5
    if (serialHandler.isActivated(5)) {
      stateMachine.setState(new Etat5(stateMachine, serialHandler, apiHandler,p));
    }
  }
}
