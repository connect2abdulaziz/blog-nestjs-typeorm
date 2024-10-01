import { IsNotEmpty, IsEmail, IsString, MinLength, Matches, Validate } from 'class-validator';
import { Match } from '../../decorators/match.decorator'; 

export class SignupDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  readonly firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  readonly lastName: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  readonly password: string;

  @IsNotEmpty({ message: 'Please confirm your password' })
  @IsString({ message: 'Confirm password must be a string' })
  @Validate(Match, ['password'], {
    message: 'Passwords do not match',
  })
  readonly confirmPassword: string;
}
