// 3 services à l'aide de axios pour les requêttes et réponses HTTP

import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "signin", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user", "post");
  }

  register(user) {
    return axios.post(API_URL + "signup", {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }
}

export default new AuthService();
