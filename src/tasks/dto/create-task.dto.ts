import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  dateTimeReminder: string;
  @IsNotEmpty()
  @IsString()
  time: string;
  status: boolean;
  @IsString()
  @IsNotEmpty()
  priority: string;
  @IsString()
  @IsNotEmpty()
  category: string;
  @IsString()
  @IsNotEmpty()
  idNotification: string;

  user_Id: string;
}
