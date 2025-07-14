export interface OssFileResponse {
  url: string; // 可访问的签名URL
  key: string; // OSS存储路径
  contentType: string; // 文件类型
  size?: number; // 文件大小（字节）
  expires?: number; // URL过期时间（秒）
  lastModified?: Date; // 最后修改时间
}
