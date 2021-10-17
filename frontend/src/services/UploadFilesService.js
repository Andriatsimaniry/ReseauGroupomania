import http from "../http-common";
import { authHeader } from "../services/auth-header";

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();
    let headers = authHeader();
    headers["Content-Type"] = "multipart/form-data";

    formData.append("file", file);

    return http.post("/upload", formData, headers, {
      onUploadProgress,
    });
  }

  getFiles() {
    return http.get("/files", { headers: authHeader() });
  }
}

export default new UploadFilesService();
