// Opération CRUD Post

import http from "../http-common";
import { authHeader } from "../services/auth-header";

class CommentService {
  create(postId, data) {
    return http.post(`/posts/${postId}/comment`, data, {
      headers: authHeader(),
    });
  }

  getAll(postId) {
    return http.get(`/posts/${postId}/comment`, { headers: authHeader() });
  }

  update(postId, commentId, data) {
    return http.put(`/posts/${postId}/comment/${commentId}`, data, {
      headers: authHeader(),
    });
  }

  delete(postId, commentId) {
    return http.delete(`/posts/${postId}/comment/${commentId}`, {
      headers: authHeader(),
    });
  }
}

export default new CommentService();
