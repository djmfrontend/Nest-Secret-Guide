import { Body, Controller, Post, Sse, Res } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
@Controller('ai')
export class AiController {
  constructor(private readonly httpService: HttpService) {}

  @Post('chat')
  chat() {
    return 'hello world';
  }
  @Post('stream')
  @Sse() // 使用Server-Sent Events 响应
  stream(@Body() body: CreateMessageDto): Observable<{ data: string }> {
    const SILICONFLOW_API = 'https://api.siliconflow.cn/v1/chat/completions';
    // 请求文档 https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions#llm
    const secretKey = process.env.SiliconCloudKey;
    return new Observable((observer) => {
      this.httpService
        .post(
          SILICONFLOW_API,
          { ...body, stream: true }, // 确保启用 stream
          {
            headers: { Authorization: `Bearer ${secretKey}` },
            responseType: 'stream', // 关键：使用 Node.js 流
          },
        )
        .subscribe({
          next: (response) => {
            response.data.on('data', (chunk: Buffer) => {
              observer.next({
                data: chunk.toString('hex'), // 转为十六进制字符串
                // 或使用 base64: chunk.toString('base64')
              });
            });
            response.data.on('end', () => observer.complete());
          },
          error: (err) => observer.error(err),
        });
    });
  }
}
