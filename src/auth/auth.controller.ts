import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { updateUsersDTO } from 'src/user/dto/update-user.dto';
import { UserResponse } from 'src/user/types/type';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userservice: UserService,
    private readonly jwtservice: JwtService,
  ) {}

  @Post('validateEmail')
  async validateEmail(@Body() { email }: { email: string }) {
    console.log('recibiendo email', email);

    try {
      const isEmailTaken = await this.userservice.findEmail(email);
      console.log('estoy en authcontroller', isEmailTaken);

      if (!isEmailTaken) {
        throw new BadRequestException({
          statusCode: 400,
          message: {
            email: ['no se encontro ningun email'],
          },
        });
      }
      return isEmailTaken;
    } catch (error) {
      console.error('Error in validateEmail:', error);

      throw new HttpException(
        BadRequestException,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('register')
  async create(@Body() createuserdto: CreateUserDto) {
    console.log('register', createuserdto);

    const { email } = createuserdto;
    const alreadyUser = await this.userservice.findEmail(email);
    if (alreadyUser) {
      throw new BadRequestException({
        statusCode: 400,
        message: {
          email: ['Email already exists'],
        },
      });
    }
    if (createuserdto.password !== createuserdto.confirmpassword) {
      throw new BadRequestException({
        statusCode: 400,
        message: {
          email: ['Las contraseñas no coinciden'],
        },
      });
    }
    const user = await this.userservice.create(createuserdto);
    console.log(user);

    const { ...result } = user;
    return result as UserResponse;
  }
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginUserDto) {
    const user = await this.userservice.validateUser(
      loginDto.email,
      loginDto.password,
    );
    console.log(user);

    if (!user) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
    const payload = { sub: user.id };
    console.log(payload);

    const accessToken = this.jwtservice.sign(payload);

    const { ...rest } = user;
    return { accessToken, user: rest };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('updateUser')
  async UpdateUser(@Body() updateDto: updateUsersDTO, @Req() req) {
    const { name, password, newPassword } = updateDto;
    console.log('soy el controller', req.user);

    if (!req.user || !req.user.id) {
      throw new HttpException(
        'Usuario no autenticado',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (password && newPassword === '') {
      throw new HttpException(
        'llenar nueva contraseña',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userId = req.user.id;
    console.log('id de usuario', userId);
    const updateDtos: updateUsersDTO = {
      email: req.user.email,
      name: name || undefined,
      password,
      newPassword: newPassword || undefined,
    };
    const res = await this.userservice.updateUserData(updateDtos);
    return res;
  }

  @HttpCode(200)
  @Post('validate-token')
  async validateToken(@Body() body: { token: string }) {
    try {
      const { sub } = this.jwtservice.verify(body.token);
      const user = await this.userservice.findOne(sub);
      if (!user) {
        throw new UnauthorizedException('Token Inválido');
      }
      const { password, ...rest } = user;

      console.log('Validación exitosa:', user);

      return { user: rest, accessToken: body.token };
    } catch (error) {
      console.log('el error es ', error);

      // Maneja específicamente los errores de autorización
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expirado');
      }

      throw new BadRequestException({
        message: `${error.message || 'Error desconocido'}`,
      });
    }
  }
}
