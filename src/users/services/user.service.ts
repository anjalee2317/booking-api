import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../types/user.types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });

    // Omit password when returning user
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users as User[];
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user as User;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // If updating email, check if it's already existing
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email is already existing');
      }
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return updatedUser as User;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return deletedUser as User;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
