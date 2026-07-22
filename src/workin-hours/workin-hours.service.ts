import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateWorkinHourDto } from './dto/update-workin-hour.dto';
import { CreateWorkingScheduleDto } from './dto/create-wroking.dto';
import { errorResponse } from 'src/utils/response';
import { PrismaService } from 'src/prisma/prisma';
import { Prisma } from '@prisma/client';
import { CreateWorkingScheduleItemDto } from './dto/create-working-schedule.dto';

@Injectable()
export class WorkinHoursService {
  constructor(
    private readonly workingservice: PrismaService,
    private readonly branchService: PrismaService,
  ) {}
  async create(dto: CreateWorkingScheduleDto) {
    try {
      const { branchId, schedules } = dto;

      // Branch mavjudligini tekshirish
      const branch = await this.branchService.branch.findUnique({
        where: { id: branchId },
      });

      if (!branch) {
        throw new NotFoundException('Branch not found');
      }

      // Oldin schedule yaratilganmi
      const exists = await this.workingservice.workingSchedule.findFirst({
        where: { branchId },
      });

      if (exists) {
        throw new ConflictException(
          'Working schedule already exists for this branch',
        );
      }

      const result: Prisma.WorkingScheduleGetPayload<{
        include: {
          periods: true;
        };
      }>[] = [];

      for (const schedule of schedules) {
        for (const day of schedule.days) {
          const workingSchedules =
            await this.workingservice.workingSchedule.create({
              data: {
                branchId,
                day,
                isClosed: schedule.isClosed ?? false,

                periods: {
                  create: schedule.periods.map((period) => ({
                    periodType: period.periodType,
                    startTime: period.startTime,
                    endTime: period.endTime,
                  })),
                },
              },
              include: {
                periods: true,
              },
            });

          result.push(workingSchedules);
        }
      }

      return result;
    } catch (error) {
      errorResponse(error);
    }
  }

  async findAllBranchId(branchId:string) {
    try {
      const workings = await this.branchService.workingSchedule.findFirst({where:{branchId}})
      if(!workings){
        throw new NotFoundException('This branch working schedule not found')
      }
      return workings
    } catch (error) {
      errorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      const schedule =await this.workingservice.workingSchedule.findUnique({where:{id}})
    } catch (error) {
      errorResponse(error);
    }
  }

async update(
  branchId: string,
  dto: UpdateWorkinHourDto,
) {
  try {
    const branch = await this.branchService.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    await this.workingservice.$transaction(async (tx) => {
      // 1. Oldin barcha periodlarni o'chiramiz
      await tx.workingPeriod.deleteMany({
        where: {
          schedule: {
            branchId,
          },
        },
      });

      // 2. Keyin schedulelarni o'chiramiz
      await tx.workingSchedule.deleteMany({
        where: {
          branchId,
        },
      });

      // 3. Yangi schedulelarni yaratamiz
      for (const schedule of dto.schedules as CreateWorkingScheduleItemDto[]) {
        for (const day of schedule.days) {
          await tx.workingSchedule.create({
            data: {
              branchId,
              day,
              isClosed: schedule.isClosed ?? false,

              periods: {
                create: schedule.periods.map((period) => ({
                  periodType: period.periodType,
                  startTime: period.startTime,
                  endTime: period.endTime,
                })),
              },
            },
          });
        }
      }
    });

    return await this.workingservice.workingSchedule.findMany({
      where: {
        branchId,
      },
      include: {
        periods: {
          orderBy: {
            startTime: 'asc',
          },
        },
      },
      orderBy: {
        day: 'asc',
      },
    });
  } catch (error) {
    errorResponse(error);
  }
}

  async delete(branchId: string) {
  try {
    const branch = await this.branchService.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    await this.workingservice.workingSchedule.deleteMany({
      where: {
        branchId,
      },
    });

    return {
      message: 'Working schedule deleted successfully',
    };
  } catch (error) {
    errorResponse(error);
  }
}
}
