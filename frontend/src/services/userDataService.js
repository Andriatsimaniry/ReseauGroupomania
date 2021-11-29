//  Opération CRUD user
import http from "../http-common";
import { authHeader } from "../services/auth-header";

class UserDataService {
  getAll() {
    return http.get("/users", { headers: authHeader() });
  }

  updatePassword(id, data) {
    return http.put(`/users/${id}/changepassword`, data, { headers: authHeader() });
  }

  delete(id) {
    return http.delete(`/users/${id}`, { headers: authHeader() });
  }
  getById(id){
    return http.get(`/users/${id}`, { headers: authHeader() });
  }

}

export default new UserDataService();
