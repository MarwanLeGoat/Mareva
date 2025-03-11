import processing.sound.*;

class Etat2 extends State {
  SoundFile file;
  PImage img;
  PImage qrcode;
  
  int sargasseId = -1;
  int lastRequestTime = 0;  // Dernière fois où la requête a été envoyée.

  Etat2(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    // Load a soundfile from the /data folder of the sketch and play it back
    file = new SoundFile(p, "soft-alert.mp3");
    file.play();
    img=loadImage("Etat25.png");
    
    ZXING4P qrcoder = new ZXING4P();
  
    qrcode = qrcoder.generateQRCode(BASE_URL, 300, 300);
    
    serialHandler.sendCommand("BOUEE_ON");
    sargasseId = apiHandler.postDetection(2, 1); // Ajoute une sargasse

  }

  void onEnter() {
  }

  void update() {
    image(img,0,0,width,height);
    image(qrcode,width-300,100,300,300);

    fill(0);
    textSize(32);

    int currentTime = millis();

    if (currentTime - lastRequestTime > 500) {
        lastRequestTime = currentTime;
      // Si capteur 2 activé -> passe à état 3
        if (apiHandler.checkPecheur(sargasseId)) {
          stateMachine.setState(new Etat25(stateMachine, serialHandler, apiHandler,p));
        }
     }
     
    if (!serialHandler.isActivated(3)) {
      stateMachine.setState(new ErrorStateBateau(stateMachine, serialHandler, apiHandler,p, this));
    }
    if (!serialHandler.isActivated(4)) {
      stateMachine.setState(new ErrorStateCamion(stateMachine, serialHandler, apiHandler,p, this));
    }
  }
  
}
