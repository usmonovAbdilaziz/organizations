import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma';
import { errorResponse, successResponse } from 'src/utils/response';
import { UpdateRoleDto } from './dto/updateRoleDto0';
import { AttachmentUserDto } from './dto/attachment-user.dto';
import { UserRole } from '@prisma/client';
import { PasswordService } from 'src/auth/utils/password';

@Injectable()
export class UserService {
  constructor(
    private readonly userServise: PrismaService,
    private readonly organizationService: PrismaService,
    private readonly branchService: PrismaService,
    private readonly passwordService: PasswordService,
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const { phoneNumber, username, organizationId, branchId, password } =
        createUserDto;
      const existingUser = await this.userServise.user.findFirst({
        where: { OR: [{ phoneNumber }, { username }] },
      });
      if (existingUser) {
        if (existingUser.phoneNumber === phoneNumber) {
          throw new ConflictException('Phone number already exists');
        }
        if (existingUser.username === username) {
          throw new ConflictException('Username already exists');
        }
      }

      if (organizationId) {
        const organization =
          await this.organizationService.organization.findUnique({
            where: { id: organizationId },
          });
        if (!organization) {
          throw new NotFoundException('Organization not found');
        }
      }

      if (branchId) {
        const branch = await this.branchService.branch.findUnique({
          where: { id: branchId },
        });
        if (!branch) {
          throw new NotFoundException('Branch not found');
        }
      }

      // prepare data for Prisma (do not store raw password)
      const data: any = { ...createUserDto };
      if (password) {
        // hash password and store salt/hash instead
        data.password = await this.passwordService.hash(password);

      }

      return this.userServise.user.create({ data });
    } catch (error) {
      errorResponse(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userServise.user.findMany({
        include: { branch: true, organization: true },
      });
      return users;
    } catch (error) {
      errorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userServise.user.findUnique({
        where: { id },
        include: { branch: true, organization: true },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      errorResponse(error);
    }
  }
  async findByPhoneNumber(phone: string) {
    try {
      const user = await this.userServise.user.findUnique({
        where: { phoneNumber: phone },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      errorResponse(error);
    }
  }
  async findStaffOrg(branchId: string) {
    const branches = await this.branchService.branch.findUnique({
      where: { id: branchId },
    });
    if (!branches) {
      throw new NotFoundException('Filial topilmadi');
    }
    const allUsers = await this.userServise.user.findMany({
      where: {
        OR: [{ organizationId: branches.organizationId }, { branchId }],
      },
    });
    return allUsers;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const newUser = this.userServise.user.update({
        where: { id },
        data: updateUserDto,
      });
      return newUser;
    } catch (error) {
      errorResponse(error);
    }
  }
  async updateAttachment(id: string, dto: AttachmentUserDto) {
    try {
      const { organizationId, branchId, role, isMultply } = dto;
      if ((!organizationId || !branchId) && !role) {
        throw new NotFoundException(
          'OrganizationId or branchId notfound, might role need value',
        );
      }

      const user = await this.userServise.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Organization bilan ishlash
      if (organizationId) {
        const organization =
          await this.organizationService.organization.findUnique({
            where: { id: organizationId },
          });

        if (!organization) {
          throw new NotFoundException('Organization not found');
        }

        if (role !== UserRole.ORGANIZATION) {
          throw new BadRequestException('User role must be ORGANIZATION');
        }

        return await this.userServise.user.update({
          where: { id },
          data: {
            organizationId: isMultply ? null : organizationId,
          },
        });
      }

      // Branch bilan ishlash
      if (branchId) {
        const branch = await this.branchService.branch.findUnique({
          where: { id: branchId },
        });

        if (!branch) {
          throw new NotFoundException('Branch not found');
        }

        return await this.userServise.user.update({
          where: { id },
          data: {
            branchId: isMultply ? null : branchId,
          },
        });
      }

      throw new BadRequestException('organizationId or branchId is required');
    } catch (error) {
      errorResponse(error);
    }
  }
  async updateRole(id: string, updateRole: UpdateRoleDto) {
    try {
      await this.findOne(id);
      const user = await this.userServise.user.update({
        where: { id },
        data: { role: updateRole.role },
      });
      return user;
    } catch (error) {
      errorResponse(error);
    }
  }

  /** Parolni yangilash (hash qilinadi) */
  async updatePassword(
    id: string,
    newPassword: string,
    oldPassword?: string,
  ) {
    try {
      const user = await this.userServise.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isValid = await this.passwordService.verify(
        user.password as string,
        oldPassword as string,
      );

      if (!isValid) {
        throw new BadRequestException('Old password is incorrect');
      }

      const passwordHash = await this.passwordService.hash(newPassword);

      return await this.userServise.user.update({
        where: { id },
        data: {
          password: passwordHash,
        },
      });
    } catch (error) {
      errorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.userServise.user.delete({
        where: { id },
      });
      return successResponse(user);
    } catch (error) {
      errorResponse(error);
    }
  }
}
