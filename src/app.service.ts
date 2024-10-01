import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name); // Add logger for tracing

  constructor(private readonly configService: ConfigService) {} // Inject config service if needed

  /**
   * Returns a greeting message.
   * Can be personalized using the 'name' parameter.
   * 
   * @param name Optional parameter to personalize the greeting.
   * @returns A greeting message.
   */
  getGreeting(name?: string): string {
    const defaultGreeting = this.configService.get<string>('DEFAULT_GREETING') || 'Hello, World!';
    
    const personalizedGreeting = name ? `${name}!` : defaultGreeting;
    
    this.logger.log(`Greeting message generated: ${personalizedGreeting}`); // Log the message generation
    
    return personalizedGreeting;
  }
}
