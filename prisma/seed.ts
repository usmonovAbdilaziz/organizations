import { PrismaClient, UserRole, Status } from '@prisma/client';
import * as argon2 from 'argon2';
import regions from '../region/region.json'
import districts from '../district/district-clean.json'
const prisma = new PrismaClient();

async function createUser(data: {
  phoneNumber: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: UserRole;
}) {
  const exists = await prisma.user.findFirst({
    where: {
      OR: [
        { username: data.username },
        { phoneNumber: data.phoneNumber },
        { email: data.email },
      ],
    },
  });

  if (exists) {
    console.log(`✔ ${data.role} already exists`);
    return;
  }

  const hash = await argon2.hash(data.password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });

  await prisma.user.create({
    data: {
      phoneNumber: data.phoneNumber,
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      password: hash,
      role: data.role,
      status: Status.ACTIVE,
    },
  });

  console.log(`✅ ${data.role} created`);
}

async function main() {
  await createUser({
    fullName: 'Super Administrator',
    username: 'superadmin',
    phoneNumber: '+998900000001',
    email: 'superadmin@example.com',
    password: '123456',
    role: UserRole.SUPER_ADMIN,
  });

  await createUser({
    fullName: 'Administrator',
    username: 'admin',
    phoneNumber: '+998900000002',
    email: 'admin@example.com',
    password: '123456',
    role: UserRole.ADMIN,
  });

  await createUser({
    fullName: 'Moderator',
    username: 'moderator',
    phoneNumber: '+998900000003',
    email: 'moderator@example.com',
    password: '123456',
    role: UserRole.DIRECTOR,
  });

  await createUser({
    fullName: 'Organization Owner',
    username: 'owner',
    phoneNumber: '+998900000004',
    email: 'owner@example.com',
    password: '123456',
    role: UserRole.ORGANIZATION,
  });

  await createUser({
    fullName: 'Client User',
    username: 'client',
    phoneNumber: '+998900000005',
    email: 'client@example.com',
    password: '123456',
    role: UserRole.CLIENT,
  });
 
}
 async function seedRegionsAndDistricts() {
  const regionMap = new Map<number, string>();

  // Regionlarni yaratish
  for (const region of regions) {
    const created = await prisma.region.upsert({
      where: {
        slug: region.slug,
      },
      update: {},
      create: {
        nameUz: region.nameUz,
        nameRu: region.nameRu,
        nameEn: region.nameEn,
        slug: region.slug,
      },
    });

    regionMap.set(region.id, created.id);
  }

  console.log("✅ Regions created");

  // Districtlarni yaratish
  for (const district of districts) {
    const prismaRegionId = regionMap.get(Number(district.regionId));

    if (!prismaRegionId) {
      console.log(
        `❌ Region topilmadi (${district.regionId}) -> ${district.nameUz}`,
      );
      continue;
    }

    await prisma.district.upsert({
      where: {
        slug: district.slug,
      },
      update: {},
      create: {
        regionId: prismaRegionId,

        nameUz: district.nameUz,
        nameRu: district.nameRu,
        nameEn: district.nameEn,
        slug: district.slug,
      },
    });
  }

  console.log("✅ Districts created");
}


main()
  .then(async () => {
     await seedRegionsAndDistricts();
     await prisma.$disconnect();
     console.log('🌱 Database seeded successfully');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });