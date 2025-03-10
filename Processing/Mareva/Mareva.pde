StateMachine stateMachine;
SerialHandler serialHandler;
ApiHandler apiHandler;

void setup() {
  fullScreen(P2D);  // Mode plein écran avec accélération GPU
  stateMachine = new StateMachine();
  apiHandler = new ApiHandler("http://mareva.aynos.net/api/detection");
  serialHandler = new SerialHandler(this, "COM4", 9600);

  stateMachine.setState(new Etat0(stateMachine, serialHandler, apiHandler,this)); // Écran 1
}

void draw() {
  stateMachine.update();
}


void serialEvent(Serial p){
  serialHandler.processSerialData(p.readStringUntil('\n'));
}
