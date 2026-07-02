# Auth implementation summary (task.md)

Qisqacha: quyida login/register va token oqimi qanday ishlashi, qaysi fayllar qo'shilgani/yangilangani, va keyingi qadamlar keltirilgan.

## Asosiy tamoyillar
- Parollar plain text saqlanmaydi — `node:crypto` `scrypt` ishlatildi.
- Access va Refresh tokenlar ajratilgan va `JwtService` orqali imzolanadi.
- Refresh tokenlar DBda hashed (sha256) holda saqlanadi va rotation/revoke qo'llanadi.

## Endpoints
- `POST /auth` — mavjud (telegram/old flow) login (original `LoginDto`).
- `POST /auth/register` — parol bilan ro'yxatdan o'tish (DTO: `RegisterPasswordDto`).
- `POST /auth/login` — parol bilan login (DTO: `LoginPasswordDto`).
- `POST /auth/refresh` — refresh token orqali yangilash.
- `POST /auth/logout` — refresh tokenni bekor qilish.
- `POST /auth/recover` — parol tiklash uchun token so'rov (DTO: `RecoverRequestDto`).
- `POST /auth/reset` — token + yangi parol bilan tiklash (DTO: `ResetPasswordDto`).

## Token va parol util'lari
- `src/auth/utils/password.ts` — `hashPassword(password)` va `verifyPassword(password,salt,hash)` (scrypt + secure salt + timingSafeEqual).
- `src/utils/token.ts` (TokenService) — yangi API:
  - `generateAccessToken(user)`
  - `generateRefreshToken(user)`
  - `verifyAccessToken(token)`
  - `verifyRefreshToken(token)`
  - `generateTokenPair(user)` → `{ accessToken, refreshToken, accessExpiresIn, refreshExpiresIn }`
  - `rotateRefreshToken(oldToken, payload, persist?)` — optional persist callback for DB rotation.

## DB o'zgarishlari (Prisma)
- `User` modelga: `passwordHash String?`, `passwordSalt String?` qo'shildi.
- Yangi model: `RefreshToken` (id, tokenHash, userId, revoked, expiresAt).
- Yangi model: `RecoveryToken` (password recovery tokenlar uchun).

## Xizmatlar
- `src/auth/refresh-token.service.ts` — refresh tokenlarni hash qilib yaratish, topish, revoke qilish.
- `src/auth/recovery.service.ts` — tiklash tokenlarini yaratish, tekshirish va consume qilish.
- `AuthService` yangilandi:
  - `login(createAuthDto)` — telegram/old flow: user topiladi yoki yaratiladi, token pair yaratiladi, refresh token saqlanadi.
  - `registerWithPassword(dto)` — password bilan ro'yxatdan o'tish: hash saqlash + pair yaratish + refresh saqlash.
  - `loginWithPassword(dto)` — identifier (username yoki phone) + password tekshiriladi, pair yaratiladi va refresh saqlanadi.
  - `refresh(refreshToken)` — verify, revoke, yangi pair va yangi refresh saqlash.
  - `logout(refreshToken)` — revoke.
  - `requestPasswordRecovery(identifier)` — recovery token yaratadi (`RecoveryService.create`) va (hozir) tokenni qaytaradi (keyinchalik SMS/Email yuborish qo'shiladi).
  - `resetPassword(token,newPassword)` — tokenni tekshiradi, parolni yangilaydi va tokenni consume qiladi.

## Muhim fayllar (yaratilgan/yangilangan)
- `src/auth/utils/password.ts` (yangi)
- `src/utils/token.ts` (refactor)
- `src/auth/refresh-token.service.ts` (yangi)
- `src/auth/recovery.service.ts` (yangi)
- `src/auth/auth.service.ts` (yangilandi)
- `src/auth/auth.controller.ts` (yangilandi)
- `src/auth/dto/*` (yangi DTOlar)
- `prisma/schema.prisma` (User password fields, RefreshToken, RecoveryToken qo'shildi)

## Lokal ishga tushirish / migratsiya
- Agar ma'lumotlarni yo'qotishga tayyor bo'lsangiz: `npx prisma migrate dev --name add_refresh_and_passwords`.
- Non-destructive qo'llash: `npx prisma db push` keyin `npx prisma generate`.

## Xavfsizlik / keyingi qadamlar
- Parollar uchun `scrypt` parametrlarini (N,r,p) ishlab chiqarish uchun tekshirish mumkin.
- Recovery tokenni foydalanuvchiga yuborish (SMS/Email) integratsiyasini qo'shish (Twilio/SMTP).
- Rate-limit refresh va recovery endpointlarini qo'shish.
- Unit testlarni qo'shish (password utils, token rotation, refresh flow).

---
Bu fayl qisqa hujjat sifatida loyihaning auth ta'minotini tavsiflaydi. Qo'shimcha niyat bo'lsa, men ushbu `task.md`ni kengaytirib, endpoint misollari va cURL namunalarini qo'shaman.
