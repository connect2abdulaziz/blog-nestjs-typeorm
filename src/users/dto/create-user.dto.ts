import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsBoolean,
  Matches,
  ValidateIf,
} from 'class-validator';

/**
 * DTO for creating a new user.
 * Validates user input data with proper rules for each field.
 */
export class CreateUserDto {
  
  /**
   * The user's first name. Must be a string with a minimum length of 2 characters.
   */
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a valid string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  firstName: string;

  /**
   * The user's last name. Must be a string with a minimum length of 2 characters.
   */
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a valid string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  lastName: string;

  /**
   * The user's email address. Must be a valid email format.
   */
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  /**
   * Optional URL to the user's profile picture. Must be a valid string if provided.
   */
  @IsOptional()
  @IsString({ message: 'Profile picture must be a valid string' })
  profilePicture?: string;

  /**
   * Optional URL to the user's thumbnail image. Must be a valid string if provided.
   */
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a valid string' })
  thumbnail?: string;

  /**
   * Indicates if the user is verified. Defaults to false if not provided.
   */
  @IsOptional()
  @IsBoolean({ message: 'isVerified must be a boolean value' })
  isVerified: boolean = false; // Default value handled in DTO initialization

  /**
   * The user's password. Must include at least:
   * - 1 uppercase letter
   * - 1 lowercase letter
   * - 1 number
   * - 1 special character (@$!%*?&)
   * Minimum length of 8 characters.
   */
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)',
  })
  password: string;

  /**
   * Password confirmation. Must match the provided password.
   */
  @IsNotEmpty({ message: 'Password confirmation is required' })
  @ValidateIf((o) => o.password === o.passwordConfirm, {
    message: 'Password confirmation must match the password',
  })
  @MinLength(8, { message: 'Password confirmation must be at least 8 characters long' })
  passwordConfirm: string;
}
