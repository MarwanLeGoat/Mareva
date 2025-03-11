import processing.sound.*;

class Etat5 extends State {
  SoundFile file;
  PImage img;

  int lastRequestTime = millis();  // Dernière fois où la requête a été envoyée.


  Etat5(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
   img=loadImage("Etat6.png");

  }

  void onEnter() {
    serialHandler.sendCommand("CAMION_OFF");
    println("Fin de l'expérience...");

  }

  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);
  int currentTime = millis();
  if (currentTime - lastRequestTime > 10000) {
      lastRequestTime = currentTime;
       stateMachine.setState(new Etat0(stateMachine, serialHandler, apiHandler,p));

  }
  }
}
