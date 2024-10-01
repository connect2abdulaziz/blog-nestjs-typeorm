import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from 'src/integrations/sg/email.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as sgMail from '@sendgrid/mail';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { LoginResponse } from './dto/auth';
import { ErrorMessages } from 'src/constants/messages.constants';
import { User as UserResponse } from '../users/dto/users';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    sgMail.setApiKey(
      this.configService.get<string>('SENDGRID_API_KEY') || 'your Key',
    );
  }

  async signup(signupDto: SignupDto): Promise<{ id: number }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: signupDto.email },
    });
    if (existingUser) {
      throw new ConflictException(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = this.userRepository.create({
      ...signupDto,
      isVerified: false,
      verificationToken,
    });

    await this.emailService.sendVerificationEmail(
      signupDto.email,
      verificationToken,
    );
    await this.userRepository.save(user);
    return { id: user.id };
  }

  async verifyEmail(token: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
    }

    if (user.isVerified) {
      throw new BadRequestException(ErrorMessages.USER_ALREADY_VERIFIED);
    }

    if (user.verificationToken === token) {
      user.isVerified = true;
      user.verificationToken = '';
      await this.userRepository.save(user);
      const {password, verificationToken,  ...cleanedUser} = user;
      return cleanedUser;
    }

    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user?.password))) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.verificationToken,
      );

      throw new UnauthorizedException(ErrorMessages.EMAIL_NOT_VERIFIED);
    }

    const payload = {
      sub: user.id.toString(),
      username: `${user.firstName} ${user.lastName}`,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload);
    return { id: user.id, accessToken, refreshToken };
  }

  async forgotPassword ({email} : { email: string}) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(ErrorMessages.EMAIL_NOT_FOUND);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.verificationToken = resetToken;
    await this.userRepository.save(user);

    await this.emailService.sendResetEmail(
      email,
      resetToken,
    );
  }
  
  async resetPassword(token: string, {newPassword}: {newPassword: string} ):Promise<UserResponse | null> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException(ErrorMessages.INVALID_TOKEN);
    }

    if (user.verificationToken === token) {
      user.password = newPassword;
      user.verificationToken = '';
      await this.userRepository.save(user);
      const { password, verificationToken,  ...cleanedUser } = user;
      return cleanedUser;
    }

    return null;
  }

}