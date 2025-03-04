import processing.serial.*;

class SerialHandler {
  Serial serial;
  HashMap<Integer, Boolean> sensorStates = new HashMap<>();

  SerialHandler(PApplet parent, String port, int baudRate) {
    serial = new Serial(parent, port, baudRate);
    serial.bufferUntil('\n');  
    println(port + baudRate);
  }
 
  void processSerialData(String line) {
    
    if (line != null) {
      line = trim(line);
      println("[Arduino] " + line);

      String[] parts = split(line, ' ');
      if (parts.length == 2) {
        int sensorId = int(parts[0].split("_")[1]);
        boolean activated = parts[1].equals("ACTIVE");
        sensorStates.put(sensorId, activated);
      }
    }
  }

  boolean isActivated(int sensorId) {
    return sensorStates.getOrDefault(sensorId, false);
  }

  void sendCommand(String command) {
    serial.write(command + "\n");
  }
}
