class StateMachine {
  private State currentState;

  void setState(State newState) {
    currentState = newState;
    newState.onEnter(); // Exécuter une action à l'entrée
  }

  void update() {
    if (currentState != null) {
      currentState.update();
    }
  }
}
