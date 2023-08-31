import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/input/create-user.dto';
import { GetUserArg } from './dtos/args/get-user.dto';
import { UserRepository } from './user.repository';
import { UserDocument } from './models/user.schema';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUser(user: GetUserArg) {
    const document = await this.userRepo.findOne(user);
    return this.toModel(document);
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      await this.userRepo.findOne({ email: createUserDto.email });
      throw new UnprocessableEntityException('User already exist');
    } catch (error) {
      const document = await this.userRepo.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      });

      return this.toModel(document);
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userRepo.findOne({ email });
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.toModel(user);
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Database error');
      }
    }
  }

  private toModel(userDocument: UserDocument): User {
    return {
      _id: userDocument._id.toHexString(),
      email: userDocument.email,
    };
  }
}
