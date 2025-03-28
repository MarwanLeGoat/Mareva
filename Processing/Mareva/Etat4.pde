import processing.sound.*;

class Etat4 extends State {
  SoundFile file;
  PImage img;
  int lastRequestTime = millis();  // Dernière fois où la requête a été envoyée.


  Etat4(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("Etat4.png");
    file = new SoundFile(p, "soft-bell.mp3");
    file.play();
    lastRequestTime = millis();
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
    
      int currentTime = millis();
  // On a utilisé ça parce que les capteurs ne marchaient pas pour la démo ducoup on a du passer automatiquement la slide
  // if (currentTime - lastRequestTime > 30000) {
  //     lastRequestTime = currentTime;
  //      stateMachine.setState(new Etat5(stateMachine, serialHandler, apiHandler,p));
  // }
  }
}
