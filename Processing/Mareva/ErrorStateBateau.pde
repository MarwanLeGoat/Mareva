import processing.sound.*;

class ErrorStateBateau extends State {
  SoundFile file;
  PImage img;
  State callback;
  
  ErrorStateBateau(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    super(sm, sh, ah,p);
    img=loadImage("ErrorStateBateau.png");

  }
  
  ErrorStateBateau(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p, State _callback) {
    super(sm, sh, ah,p);
    img=loadImage("ErrorStateBateau.png");
    callback = _callback;
    file = new SoundFile(p, "soft-error.mp3");
    file.play();
  }
      
  void update() {
    image(img,0,0,width,height);
    fill(0);
    textSize(32);
    
    if (serialHandler.isActivated(3)) {
      stateMachine.setState(callback);
    }

  }
}
