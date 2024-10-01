import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  Matches,
} from 'class-validator';

/**
 * DTO for updating an existing user.
 * All fields are optional to allow partial updates.
 */
export class UpdateUserDto {
  
  /**
   * Optional update for the user's first name.
   * Must be a string with a minimum length of 2 characters if provided.
   */
  @IsOptional()
  @IsString({ message: 'First name must be a valid string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  firstName?: string;

  /**
   * Optional update for the user's last name.
   * Must be a string with a minimum length of 2 characters if provided.
   */
  @IsOptional()
  @IsString({ message: 'Last name must be a valid string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  lastName?: string;

  /**
   * Optional update for the user's email address.
   * Must be a valid email format if provided.
   */
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  /**
   * Optional update for the user's profile picture.
   * Must be a valid string if provided.
   */
  @IsOptional()
  @IsString({ message: 'Profile picture must be a valid string' })
  profilePicture?: string;

  /**
   * Optional update for the user's thumbnail image.
   * Must be a valid string if provided.
   */
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a valid string' })
  thumbnail?: string;

  /**
   * Optional update for the verification status of the user.
   * Must be a boolean value if provided.
   */
  @IsOptional()
  @IsBoolean({ message: 'isVerified must be a boolean value' })
  isVerified?: boolean;

  /**
   * Optional update for the user's password.
   * Must include at least:
   * - 1 uppercase letter
   * - 1 lowercase letter
   * - 1 number
   * - 1 special character (@$!%*?&)
   * Minimum length of 8 characters.
   */
  @IsOptional()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)',
  })
  password?: string;

  /**
   * Optional update for the password confirmation.
   * Must match the provided password if updated.
   */
  @IsOptional()
  @MinLength(8, { message: 'Password confirmation must be at least 8 characters long' })
  passwordConfirm?: string;
}
