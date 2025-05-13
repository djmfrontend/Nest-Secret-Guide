import type { AxiosRequestConfig, Canceler } from "axios";
import axios from "axios";
import { isFunction } from "lodash";
export const getPendingUrl = (config: AxiosRequestConfig) => {
  return [config.method, config.url].join("&");
};
let pendingMap = new Map<string, Canceler>();
export class AxiosCanceler {
  addPending(config: AxiosRequestConfig) {
    this.removePending(config);
    const url = getPendingUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel: Canceler) => {
        if (!pendingMap.has(url)) {
          pendingMap.set(url, cancel);
        }
      });
  }
  /**
   * @description: Clear all pending
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel();
    });
    pendingMap.clear();
  }

  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);
    if (pendingMap.has(url)) {
      const cancel = pendingMap.get(url);
      if (cancel) {
        cancel();
      }
      pendingMap.delete(url);
    }
  }
  /**
   * @description: reset
   */
  reset(): void {
    pendingMap = new Map<string, Canceler>();
  }
}
