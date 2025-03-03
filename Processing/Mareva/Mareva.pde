StateMachine stateMachine;
SerialHandler serialHandler;
ApiHandler apiHandler;

void setup() {
  fullScreen(P2D);  // Mode plein écran avec accélération GPU
  stateMachine = new StateMachine();
  apiHandler = new ApiHandler("http://localhost/api/detection");
  apiHandler.postDetection(1,100);
  serialHandler = new SerialHandler(this, "COM4", 9600);

  stateMachine.setState(new Etat1(stateMachine, serialHandler, apiHandler)); // Écran 1
}

void draw() {
  stateMachine.update();
}
