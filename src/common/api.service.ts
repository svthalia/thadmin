import axios, { AxiosRequestConfig } from "axios";
import { AuthService } from "@/common/auth.service";

class ApiService {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  }

  setHeader() {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TokenService.getToken()}`;
  }

  get(resource) {
    return axios.get(resource);
  }

  post(resource, data) {
    return axios.post(resource, data);
  }

  put(resource, data) {
    return axios.put(resource, data);
  }

  delete(resource) {
    return axios.delete(resource);
  }

  customRequest(data: AxiosRequestConfig) {
    return axios(data);
  }

  mountRequestInterceptor() {
    this._requestInterceptor = axios.interceptors.request.use(async config => {
      console.log("show loading");
      /*
            const loading = await loadingController.create({
                message: 'Please wait...'
            });
            await loading.present();*/

      return config;
    });
  }
}

export default ApiService;
