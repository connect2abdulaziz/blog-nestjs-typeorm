import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module'; 
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { User } from '../users/users.entity';
import { EmailModule } from 'src/integrations/sg/email.module'; 

@Module({
  imports: [
    // Import the TypeORM module with the User entity
    TypeOrmModule.forFeature([User]),

    // Import UsersModule and EmailModule (for injecting UserService and EmailService)
    UsersModule, 
    EmailModule, 

    // Register JwtModule asynchronously with dynamic configuration from ConfigService
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  
  // Provide AuthService only; UsersService and EmailService are already provided by their modules
  providers: [AuthService], 

  // Register AuthController
  controllers: [AuthController],

  // Export AuthService for use in other modules
  exports: [AuthService],  
})
export class AuthModule {}
