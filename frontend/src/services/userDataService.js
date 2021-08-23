//  Opération CRUD user
import http from "../http-common";
import { authHeader } from "../services/auth-header"

class UserDataService {
  getAll() {
    return http.get("/user", {headers: authHeader()});
  }

  update(id, data) {
    return http.put(`/user/${id}`, data, {headers: authHeader()});
  }

  delete(id) {
    return http.delete(`/user/${id}`, {headers: authHeader()});
  }
}

export default new UserDataService();