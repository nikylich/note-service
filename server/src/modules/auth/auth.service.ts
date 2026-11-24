import { prisma } from '../../config/db';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../../utils/jwt';

export class AuthService {
  static async register(data: any) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Пользователь с таким email уже существует');

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken };
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Неверный email или пароль');

    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) throw new Error('Неверный email или пароль');

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken };
  }
}