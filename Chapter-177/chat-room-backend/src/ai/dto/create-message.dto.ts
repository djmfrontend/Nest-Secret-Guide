import { IsNotEmpty, isNotEmpty } from 'class-validator';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class CreateMessageDto {
  model: string; // 我使用   deepseek-ai/DeepSeek-V3
  messages: Message[];
  stream: boolean;
  max_tokens: number; // 默认512
  enable_thinking: boolean; // 默认true
  thinking_budget: number; // 默认4096
  min_p: number; // 默认0.05
  top_p: number;
  top_k: number; //默认50
  temperature: number; //默认0.7
  frequency_penalty: number; //0.5
  n: number; //1
}
