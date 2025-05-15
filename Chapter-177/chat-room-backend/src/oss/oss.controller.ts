import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OssService } from './oss.service';
import { Express } from 'express';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServerResponse } from 'http';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Get('info')
  info() {
    return this.ossService.info();
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.ossService.uploadFile(file);
    return url;
  }
  @Get('image')
  async serveImage(@Query('key') key: string, @Res() res: ServerResponse) {
    const fileStream = await this.ossService.getFileStream(key);
    fileStream.pipe(res); // 把图片流写入响应
  }
}
