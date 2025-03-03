import http.requests.*;

class ApiHandler {
  String baseUrl;

  ApiHandler(String url) {
    this.baseUrl = url;
  }

  int postDetection(int boueeId, int taille) {
    try {
      PostRequest post = new PostRequest(baseUrl);
      post.addHeader("Content-Type", "application/json");
      post.addData("{\"BoueeId\":" + boueeId + ", \"TailleEstimee\":" + taille + "}");
      post.send();

      int responseCode = 200;
      println("[POST] Code réponse : " + responseCode);
      println("[POST] Contenu de la réponse : " + post.getContent());

      if (responseCode == 200) {
        JSONObject json = parseJSONObject(post.getContent());
        if (json != null && json.hasKey("sargasseId")) {
          return json.getInt("sargasseId");
        }
      } else {
        println("[POST] Erreur : Code " + responseCode);
      }
    } catch (Exception e) {
      println("[POST] Exception : " + e.getMessage());
    }

    return -1;  // Valeur par défaut en cas d'échec
  }

  boolean checkPecheur(int sargasseId) {
    try {
      GetRequest get = new GetRequest(baseUrl + "/" + sargasseId);
      get.send();

      int responseCode = 200;
      println("[GET] Code réponse : " + responseCode);
      println("[GET] Contenu de la réponse : " + get.getContent());

      if (responseCode == 200) {
        JSONObject json = parseJSONObject(get.getContent());
        if (json != null && json.hasKey("detection")) {
          return json.getJSONObject("detection").hasKey("PecheurNom");
        }
      } else {
        println("[GET] Erreur : Code " + responseCode);
      }
    } catch (Exception e) {
      println("[GET] Exception : " + e.getMessage());
    }

    return false;  // Valeur par défaut en cas d'échec
  }
}
