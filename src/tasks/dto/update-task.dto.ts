export class UpdateTaskDto {
  id?: string;
  name?: string;
  description?: string;
  dateTimeReminder?: string;
  time?: string;
  status?: boolean;
  priority?: string;
  category?: string;
  user_Id: string;
}
