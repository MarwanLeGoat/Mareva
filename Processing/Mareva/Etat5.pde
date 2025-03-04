import processing.sound.*;

class Etat5 extends State {
  SoundFile file;
  int lastRequestTime = millis();  // Dernière fois où la requête a été envoyée.


  Etat5(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
  }

  void onEnter() {
    serialHandler.sendCommand("CAMION_OFF");
    println("Fin de l'expérience...");

  }

  void update() {
    background(100, 100, 100);
    fill(0);
    textSize(32);
    text("Écran 5 - Fin de l’expérience", 100, 100);
  int currentTime = millis();
  if (currentTime - lastRequestTime > 10000) {
      lastRequestTime = currentTime;
       stateMachine.setState(new Etat1(stateMachine, serialHandler, apiHandler,p));

  }
  }
}
