import type { AxiosInstance, CancelTokenSource } from "axios";
import axios from "axios";
import type { CreateAxiosOptions } from "./axiosTransform";
export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;
  private cancelTokens: CancelTokenSource[];

  constructor(options: CreateAxiosOptions) {
    this.cancelTokens = [];
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }
  private getTransform() {
    const { transform } = this.options;
    return transform;
  }
  /**
   * @description: Interceptor configuration 拦截器配置
   */
  setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) {
      return;
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;
  }
}
