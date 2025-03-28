import com.cage.zxing4p3.*;

StateMachine stateMachine;
SerialHandler serialHandler;
ApiHandler apiHandler;

String BASE_URL="http://mareva.aynos.net";
String SERIAL_PORT="COM4";

void setup() {
  //size(1920,1080);  // Mode fenêtré (debug)
  fullScreen();  // Mode plein écran
  
  stateMachine = new StateMachine();
  apiHandler = new ApiHandler(BASE_URL+"/api/detection"); // Remplacer "mareva.aynos.net" par le domaine / ip sur lequel est hébergé l'appli
  serialHandler = new SerialHandler(this, SERIAL_PORT, 9600); // Adapter le port COM3 en fonction de la machine (souvent entre COM2 et COM4)

  apiHandler.deleteAllSargasses();

  stateMachine.setState(new Etat0(stateMachine, serialHandler, apiHandler,this)); 
}

void draw() {
  stateMachine.update();
}


void serialEvent(Serial p){
  serialHandler.processSerialData(p.readStringUntil('\n'));
}
