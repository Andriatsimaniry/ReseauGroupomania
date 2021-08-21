import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get("/user");
  }

  update(id, data) {
    return http.put(`/user/${id}`, data);
  }

  delete(id) {
    return http.delete(`/user/${id}`);
  }
}

export default new UserDataService();