import { Body, Controller, Post, Res, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Response } from 'express';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { SuccessMessages } from 'src/constants/messages.constants';
import { Routes } from 'src/constants/routes.constants';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage(SuccessMessages.SIGNUP_SUCCESS)
  @Post(Routes.SIGNUP)
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @ResponseMessage(SuccessMessages.LOGIN_SUCCESS)
  @Post(Routes.LOGIN)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ResponseMessage(SuccessMessages.VERIFICATION_SUCCESS)
  @Post(Routes.VERIFY_EMAIL)
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @ResponseMessage(SuccessMessages.FORGOT_SUCCESS)
  @Post(Routes.FORGOT_PASSWORD)
  async forgotPassword(@Body() forgotPasswordDto : ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @ResponseMessage(SuccessMessages.RESET_SUCCESS)
  @Post(Routes.RESET_PASSWORD)
  async resetPassword(@Query('token') token: string, @Body() resetPasswordDto:ResetPasswordDto ) {
    console.log(resetPasswordDto);
    return await this.authService.resetPassword(token, resetPasswordDto);
  }


  @ResponseMessage(SuccessMessages.LOGOUT_SUCCESS)
  @Get(Routes.SIGNOUT)
  async signout(@Res() res: Response){
    //res.clearCookie('auth_token'); 
  }
}