import http from "../http-common";
import { authHeader } from "../services/auth-header"

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/upload",{headers: authHeader()}, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  }

  getFiles() {
    return http.get("/files", {headers: authHeader()});
  }
}

export default new UploadFilesService();