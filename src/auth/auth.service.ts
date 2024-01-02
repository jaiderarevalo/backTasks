import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new HttpException('no autorizado', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user.id };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
