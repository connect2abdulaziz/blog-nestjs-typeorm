import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserList } from './dto/users';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserResponse} from './dto/users';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   * @param createUserDto The data transfer object (DTO) for creating a user
   */
  async createUser(
    createUserDto: CreateUserDto,
    userId: string,
  ): Promise<UserResponse> {
    // Validate Admin
    // const adminUser = await this.userRepository.findOne({
    //   where: { id: Number(userId)},
    // });
    //if (!(adminUser.role === 'admin')) { return null; }

    // Check if a user with the same email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      // If user exists, throw ConflictException
      throw new ConflictException('A user with this email already exists');
    }

    // Create a new user instance
    const user = this.userRepository.create(createUserDto);

    // Save the new user to the database
    return await this.userRepository.save(user);
  }

  /**
   * Get paginated list of users
   * @param page The current page number
   * @param perPage The number of users per page
   */
  async getUsers(
    page: number = 1,
    perPage: number = 10,
    userId: number,
  ): Promise<UserList> {
    // Validate Admin (optional)
    // const adminUser = await this.userRepository.findOne({
    //   where: { id: Number(userId) },
    // });
    // if (!(adminUser.role === 'admin')) { return null; }

    // Ensure page and perPage are valid numbers
    const validPage = Math.max(1, Number(page)); // Ensure page is a number
    const validPerPage = Math.max(1, Number(perPage)); // Ensure perPage is a number
    const skip = (validPage - 1) * validPerPage;
    const take = (validPage);
    console.log(page, perPage, validPage, validPerPage,skip, take);
    // Fetch total count of users
    const totalCount = await this.userRepository.count();

    // Fetch paginated users
    const users: User[] = await this.userRepository.find({
      skip, take,
    });

    // Return paginated result
    return {
      users,
      totalCount,
      currentPage: validPage,
      perPage: validPerPage,
    };
  }


  /**
   * Find user by their ID
   * @param id The user's ID
   */
  async findUserById(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Update a user's profile image
   * @param id The user's ID
   * @param updateUserProfileImageDto DTO containing the new profile image URL
   */
  async updateUserProfileImage(
    id: number,
    updateUserProfileImageDto: { imageUrl: string },
  ): Promise<UserResponse> {
    const user = await this.findUserById(id);
    user.profilePicture = updateUserProfileImageDto.imageUrl;
    return this.userRepository.save(user);
  }

  /**
   * Update a user's password
   * @param id The user's ID
   * @param updateUserPasswordDto DTO containing old and new passwords
   */
  async updateUserPassword(
    id: number,
    updateUserPasswordDto: { oldPassword: string; newPassword: string },
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    // Check if the old password matches
    if (user.password !== updateUserPasswordDto.oldPassword) {
      throw new ConflictException('Old password does not match');
    }
    // Update password
    user.password = updateUserPasswordDto.newPassword;
    this.userRepository.save(user);
    return user;
  }

  /**
   * Update user details
   * @param id The user's ID
   * @param updateUserDto Data for updating the user
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.findUserById(id);
    Object.assign(user, updateUserDto); // Merge updated data
    return this.userRepository.save(user);
  }

  /**
   * Delete a user by ID
   * @param id The user's ID
   */
  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
