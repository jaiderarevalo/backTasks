import { config } from 'dotenv';
import { User } from '../../backend/task-back/src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Task } from '../task-back/src/tasks/entities/task.entity';

const env = process.env.NODE_env || 'development';
config({ path: `./.env.${env}` });

export default new DataSource({
  type: 'mysql',
  host: `${process.env.DB_HOST}`,
  port: Number(process.env.DB_PORT),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  synchronize: false,
  entities: [User, Task],
  migrationsRun: true,
  migrations: [
    './src/db/typeorm-migrations/*.ts',
    './src/db/typeorm-migrations/*.js',
  ],
});
