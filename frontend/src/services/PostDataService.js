// des méthodes pour envoyer des requêtes HTTP à l'APIs.

import http from "../http-common";
import { authHeader } from "../services/auth-header";

class PostDataService {
  getAll() {
    return http.get("/posts", { headers: authHeader() });
  }

  getPostsByUser(userId) {
    return http.get(`/posts/user/${userId}`, { headers: authHeader() });
  }

  create(data) {
    return http.post("/posts", data, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/posts/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/posts/${id}`, { headers: authHeader() });
  }
}

export default new PostDataService();
