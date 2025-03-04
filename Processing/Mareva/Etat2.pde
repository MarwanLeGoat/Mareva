import processing.sound.*;

class Etat2 extends State {
  SoundFile file;
  PImage img;

  int sargasseId = -1;
  int lastRequestTime = 0;  // Dernière fois où la requête a été envoyée.

  Etat2(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    // Load a soundfile from the /data folder of the sketch and play it back
    file = new SoundFile(p, "Etat1.mp3");
    file.play();
    img=loadImage("Etat25.png");

  }

  void onEnter() {
    serialHandler.sendCommand("BOUEE_ON");
    sargasseId = apiHandler.postDetection(2, 1); // Ajoute une sargasse
  }

  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);
    text("Écran 2 - Détection par la bouée, le pêcheur reçoit l'alerte", 100, 100);

    int currentTime = millis();
  if (currentTime - lastRequestTime > 500) {
      lastRequestTime = currentTime;
    // Si capteur 2 activé -> passe à état 3
      if (apiHandler.checkPecheur(sargasseId)) {
        stateMachine.setState(new Etat25(stateMachine, serialHandler, apiHandler,p));
      }
    }
  }
  
}
