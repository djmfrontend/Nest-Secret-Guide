import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class HistoryPageDto {
  @IsNotEmpty()
  page: number;
  @IsNotEmpty()
  size: number;
  filters?: {
    content?: string;
    type?: string;
    status?: string;
  };
  sort?: {
    field: string;
    order: 'desc' | 'asc';
  }[];
}
