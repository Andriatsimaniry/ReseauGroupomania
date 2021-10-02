// Opération CRUD Post

import http from "../http-common";
import { authHeader } from "../services/auth-header"

class PostDataService {
  getAll() {
    return http.get("/posts", {headers: authHeader()});
  }

  get(id) {
    return http.get(`/posts/${id}`, {headers: authHeader()});
  }

  create(data) {
    return http.post("/posts", data, {headers: authHeader()});
  }

  update(id, data) {
    return http.put(`/posts/${id}`, data, {headers: authHeader()});
  }

  delete(id) {
    return http.delete(`/posts/${id}`, {headers: authHeader()});
  }

  PostLike(id, data, like) {
    return http.post(`/posts/${id}/likes`, {...data, PostLike: like}, {headers: authHeader()});
  }
}

export default new PostDataService();