import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SuccessMessages } from 'src/constants/messages.constants';
import { Routes } from 'src/constants/routes.constants';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUserId } from 'src/decorators/get-user-id.decorator';

@UseGuards(AuthGuard)
@Controller(Routes.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage(SuccessMessages.USER_LIST_SUCCESS)
  @Get(Routes.GET_ALL_USERS)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @GetUserId() userId: number,
  ) {
    return this.usersService.getUsers(page, perPage, userId);
  }

  @ResponseMessage(SuccessMessages.USER_CREATED)
  @Post(Routes.CREATE_USER)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @GetUserId() userId: string,
  ) {
    return this.usersService.createUser(createUserDto, userId);
  }

  @ResponseMessage(SuccessMessages.USER_FOUND)
  @Get(Routes.GET_USER)
  async getUser(@GetUserId() userId: number) {
    return this.usersService.findUserById(userId);
  }

  @ResponseMessage(SuccessMessages.USER_UPDATED_PROFILE_IMAGE)
  @Put(Routes.UPLOAD_PROFILE_IMAGE)
  async updateUserProfileImage(
    @GetUserId() userId: number,
    @Body() updateUserProfileImageDto,
  ) {
    return this.usersService.updateUserProfileImage(userId, updateUserProfileImageDto);
  }

  @ResponseMessage(SuccessMessages.USER_UPDATED_PASSWORD)
  @Put(Routes.UPDATE_PASSWORD)
  async updateUserPassword(
    @GetUserId() userId: number,
    @Body() updateUserPasswordDto,
  ) {
    return this.usersService.updateUserPassword(userId, updateUserPasswordDto);
  }

  @ResponseMessage(SuccessMessages.USER_UPDATED)
  @Put(Routes.UPDATE_USER)
  async updateUser(
    @GetUserId() userId: number,
    @Body() updateUserDto: CreateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @ResponseMessage(SuccessMessages.USER_DELETED)
  @Delete(Routes.DELETE_USER)
  async deleteUser(@GetUserId() userId: number) {
    return this.usersService.deleteUser(userId);
  }
}
