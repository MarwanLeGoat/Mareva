StateMachine stateMachine;
SerialHandler serialHandler;
ApiHandler apiHandler;

void setup() {
  size(1920,1080);  // Mode fenêtré (debug)
  //fullScreen(P2D);  // Mode plein écran

  stateMachine = new StateMachine();
  apiHandler = new ApiHandler("http://mareva.aynos.net/api/detection"); // Remplacer "mareva.aynos.net" par le domaine / ip sur lequel est hébergé l'appli
  serialHandler = new SerialHandler(this, "COM3", 9600); // Adapter le port COM3 en fonction de la machine (souvent entre COM2 et COM4)

  stateMachine.setState(new Etat0(stateMachine, serialHandler, apiHandler,this)); 
}

void draw() {
  stateMachine.update();
}


void serialEvent(Serial p){
  serialHandler.processSerialData(p.readStringUntil('\n'));
}
