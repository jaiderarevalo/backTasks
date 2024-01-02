import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  NotFoundException,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/user/entities/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createTasksUser(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: { user: User },
  ) {
    return await this.tasksService.createTasks(createTaskDto, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':usuarioId')
  findAll(@Param('usuarioId') usuarioId: string) {
    return this.tasksService.findAll(usuarioId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('task/:Id')
  async getTask(@Param('Id') Id: string) {
    try {
      const res = await this.tasksService.getTaskId(Id);
      console.log('tarea traida correctamente', res);

      return res;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    console.log('ID antes de eliminar:', id);
    const tasks = await this.tasksService.getTaskId(id);
    if (!tasks) {
      throw new NotFoundException('tarea no encontrada ');
    }
    try {
      const task = await this.tasksService.removes(id);
      console.log(task);
    } catch (error) {
      throw error; // Puedes elegir lanzar el error o manejarlo de otra manera según tus necesidades
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  async updateTaskUser(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id') id: string,
  ) {
    console.log('como llegan los datos del front ', updateTaskDto);
    try {
      const res = await this.tasksService.UpdateTask(id, updateTaskDto);
      console.log('todos los datos ', res);
      return res;
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
