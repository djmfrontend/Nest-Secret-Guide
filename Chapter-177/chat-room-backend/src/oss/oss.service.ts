import { Injectable } from '@nestjs/common';
import { CreateOssDto } from './dto/create-oss.dto';
import { UpdateOssDto } from './dto/update-oss.dto';
import * as OSS from 'ali-oss';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class OssService {
  private client: OSS;
  constructor() {
    this.client = new OSS({
      region: process.env.BucketRegion,
      accessKeyId: process.env.AccessKeyId,
      accessKeySecret: process.env.AccessKeySecret,
      bucket: process.env.BucketName,
    });
  }
  info() {
    return this.client.getBucketInfo(process.env.BucketName);
  }
}
