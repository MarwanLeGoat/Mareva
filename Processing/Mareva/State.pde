abstract class State {
  StateMachine stateMachine;
  SerialHandler serialHandler;
  ApiHandler apiHandler;
  PApplet p;


  State(StateMachine sm, SerialHandler sh, ApiHandler ah,PApplet p) {
    this.stateMachine = sm;
    this.serialHandler = sh;
    this.apiHandler = ah;
    this.p=p;
  }

  abstract void update();
  void onEnter() {} // Méthode pour exécuter une action en entrant dans un état
}
