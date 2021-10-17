//  Opération CRUD user
import http from "../http-common";
import { authHeader } from "../services/auth-header";

class UserDataService {
  getAll() {
    return http.get("/users", { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/users/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/users/${id}`, { headers: authHeader() });
  }
}

export default new UserDataService();
