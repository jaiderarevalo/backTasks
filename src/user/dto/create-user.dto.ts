import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsString()
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  @MinLength(4, { message: 'Password is too short' })
  password: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Confirm password is too short' })
  confirmpassword: string;
}
