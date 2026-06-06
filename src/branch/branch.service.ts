import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PrismaService } from 'src/prisma/prisma';
import { errorResponse } from 'src/utils/response';
import { getDistanceFromLatLonInKm } from './get-distanse';

@Injectable()
export class BranchService {
  constructor(
    private readonly branchService: PrismaService,
    private readonly organization: PrismaService,
  ) {}
  async create(createBranchDto: CreateBranchDto) {
    try {
      const { organizationId, name } = createBranchDto;
      const existingBranch = await this.branchService.branch.findFirst({
        where: { name, organizationId },
      });
      if (existingBranch) {
        throw new ConflictException(
          'Branch with this name already exists in the organization',
        );
      }
      const organization = await this.organization.organization.findUnique({
        where: { id: organizationId },
      });
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      const newBranch = await this.branchService.branch.create({
        data: createBranchDto,
      });
      return newBranch;
    } catch (error) {
      errorResponse(error);
    }
  }

  async findAll() {
    try {
      const branches = await this.branchService.branch.findMany();
      return branches;
    } catch (error) {
      errorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      const branch = await this.branchService.branch.findUnique({
        where: { id },include:{organization:true}
      });
      if (!branch) {
        throw new NotFoundException('Branch not found');
      }
      return branch;
    } catch (error) {
      errorResponse(error);
    }
  }
  async findByOrganization(organizationId: string) {
    try {
      const branches = await this.branchService.branch.findMany({
        where: { organizationId },
      });
      return branches;
    } catch (error) {
      errorResponse(error);
    }
  }
  async findNearest(latitude: number, longitude: number, radius?: number) {
    try {
      console.log(latitude,longitude,radius);
      
      const branches = await this.branchService.branch.findMany();
      if (!branches.length) {
        throw new NotFoundException('No branches found');
      }
      if (radius) {
        const branchInRadius = branches
          .map((branch) => ({
            branch,
            distance: getDistanceFromLatLonInKm(
              latitude,
              longitude,
              branch.lat,
              branch.long,
            ),
          }))
          .filter((item) => item.distance <= radius);
        return branchInRadius;
      }
      const branchInRadius = branches.map((branch) => ({
        branch,
        distance: getDistanceFromLatLonInKm(
          latitude,
          longitude,
          branch.lat,
          branch.long,
        ),
      }));
      return branchInRadius;
    } catch (error) {
      errorResponse(error);
    }
  }
  async update(id: string, updateBranchDto: UpdateBranchDto) {
    try {
      const updatedBranch = await this.findOne(id);
      return await this.branchService.branch.update({
        where: { id },
        data: {
          ...updateBranchDto,
          organizationId: updatedBranch?.organizationId,
        },
      });
    } catch (error) {
      errorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.branchService.branch.delete({
        where: { id },
      });
    } catch (error) {
      errorResponse(error);
    }
  }
}
