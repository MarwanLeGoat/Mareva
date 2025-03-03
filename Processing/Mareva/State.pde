abstract class State {
  StateMachine stateMachine;
  SerialHandler serialHandler;
  ApiHandler apiHandler;

  State(StateMachine sm, SerialHandler sh, ApiHandler ah) {
    this.stateMachine = sm;
    this.serialHandler = sh;
    this.apiHandler = ah;
  }

  abstract void update();
  void onEnter() {} // Méthode pour exécuter une action en entrant dans un état
}
