import { Injectable } from '@nestjs/common';
import { OssFileResponse } from './dto/oss-response.dto';
import * as OSS from 'ali-oss';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';
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
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const todayPath = this.getTodayPath(); // 获取日期路径
    const uniqueFilename = `${uuidv4()}-${file.originalname}`; // 避免重名
    const ossKey = `${todayPath}/${uniqueFilename}`;

    await this.client.put(ossKey, Buffer.from(file.buffer), {
      headers: {
        'Content-Type': file.mimetype,
      },
    });
    // return `https://${process.env.BucketName}.${process.env.BucketRegion}.aliyuncs.com/${ossKey}`;
    return ossKey;
  }
  // 获取年/月/日路径
  private getTodayPath(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1); // 不补零也可以，OSS 支持 5 这样的数字
    const day = String(date.getDate());
    return `${year}/${month}/${day}`;
  }
  // 获取长期有效的签名 URL（这里设为 7 天有效期）
  getSignedUrl(key: string): string {
    return this.client.signatureUrl(key, {
      expires: 7 * 24 * 3600, // 7天有效期
      method: 'GET',
    });
  }
  async getFileStream(key: string): Promise<Readable> {
    const result = await this.client.get(key);
    // 如果 content 是 Buffer，我们把它包装成一个 Readable 流
    if (Buffer.isBuffer(result.content)) {
      return Readable.from(result.content);
    }

    // 如果已经是 Readable 流，直接返回
    if (result.content instanceof Readable) {
      return result.content;
    }
    throw new Error('Failed to get file stream from OSS');
  }

  async getFileJson(key: string): Promise<OssFileResponse> {
    if (!key || !key.trim()) {
      return {
        url: '',
        key: '',
        contentType: '',
        size: 0,
        expires: 0,
        lastModified: new Date(),
      };
    }

    const meta = await this.client.head(key);
    // 生成签名url
    const url = this.client.signatureUrl(key);
    return {
      url,
      key,
      contentType: meta.res.headers['content-type'],
      size: meta.res.headers['content-length']
        ? parseInt(meta.res.headers['content-length'])
        : undefined,
      expires: 7 * 24 * 3600, // 与签名URL保持一致
      lastModified: meta.res.headers['last-modified']
        ? new Date(meta.res.headers['last-modified'])
        : undefined,
    };
  }
  // 上传文件
}
