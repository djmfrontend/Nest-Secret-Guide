declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    AccessKeyId: string;
    AccessKeySecret: string;
    OssUser: string;
    BucketName: string;
    BucketRegion: string;
  }
}
