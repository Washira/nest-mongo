import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async validateUser(email: string, password: string): Promise<any> {
    // Find the user in the database
    const user = await this.userService.findByEmail(email);
    // Check if the provided password is valid
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}
