import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as moment from 'moment';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async createTasks(createTaskDto: CreateTaskDto, req: { user: User }) {
    console.log(createTaskDto);

    try {
      const task = this.taskRepository.create({
        name: createTaskDto.name,
        description: createTaskDto.description,
        status: createTaskDto.status,
        time: createTaskDto.time,
        dateTimeReminder: createTaskDto.dateTimeReminder,
        priority: createTaskDto.priority,
        category: createTaskDto.category,
        idNotification: createTaskDto.idNotification,
        user: req.user,
      });
      const create = await this.taskRepository.save(task);
      console.log('datos guardados', create);
      console.log('datos antes de guardar', task);

      if (!create) {
        throw new HttpException('no se pudo guardar', HttpStatus.BAD_REQUEST);
      }
      return create;
    } catch (error) {
      console.log(error);

      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async UpdateTask(id, UpdateTaskDto: UpdateTaskDto) {
    console.log('tarea del front  no guardada:', UpdateTaskDto);

    try {
      const findTask = await this.getTaskId(id);
      console.log('tareas originales', findTask);
      if (!findTask) {
        throw new HttpException(
          'No se encontro la tarea',
          HttpStatus.NOT_FOUND,
        );
      }
      const fechaFront = moment(UpdateTaskDto.dateTimeReminder).format(
        'YYYY-MM-DD',
      );

      const fechaback = moment(findTask.dateTimeReminder).format('YYYY-MM-DD');
      const horaBack = moment(findTask.time, 'h:mm').format('h:mm');
      const horafront = moment(UpdateTaskDto.time, 'h:mm').format('h:mm');
      if (
        findTask.name === UpdateTaskDto.name &&
        findTask.category === UpdateTaskDto.category &&
        findTask.description === UpdateTaskDto.description &&
        findTask.priority === UpdateTaskDto.priority &&
        findTask.status === UpdateTaskDto.status &&
        fechaFront === fechaback &&
        horaBack === horafront
      ) {
        throw new HttpException(
          'No has actualizado ningun campo',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const fusion = this.taskRepository.merge(findTask, UpdateTaskDto);
      console.log('datos Actualizados antes de guardar', fusion);
      if (!fusion) {
        throw new HttpException(
          'no se pudo fusionar la tarea',
          HttpStatus.BAD_REQUEST,
        );
      }

      const taskUpdate = await this.taskRepository.save(fusion);
      if (!taskUpdate) {
        throw new HttpException(
          'No se pudo actualizar la tarea intenta nuevamente',
          HttpStatus.BAD_REQUEST,
        );
      }
      return taskUpdate;
    } catch (error) {
      if (error) {
        throw error;
      } else {
        throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findAll(usuarioId: string) {
    return await this.taskRepository.find({
      where: {
        user: {
          id: usuarioId,
        },
      },
    });
  }

  async getTaskId(id: string): Promise<Task | undefined> {
    return await this.taskRepository.findOneBy({ id: id });
  }
  async removes(id: string) {
    const task = await this.taskRepository.delete({
      id: id,
    });
    if (!task) {
      throw new NotFoundException('id no valido');
    }
  }
}
