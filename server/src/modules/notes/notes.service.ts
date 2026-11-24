import { prisma } from '../../config/db';

export class NotesService {
  static async create(userId: number, data: any) {
    const note = await prisma.note.create({
      data: {
        ownerId: userId,
        title: data.title,
        content: data.content,
        color: data.color,
      },
    });

    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tag = await prisma.tag.upsert({
          where: { ownerId_name: { ownerId: userId, name: tagName } },
          update: {},
          create: { ownerId: userId, name: tagName },
        });
        
        await prisma.noteTag.create({
          data: { noteId: note.id, tagId: tag.id },
        });
      }
    }

    return this.getById(note.id, userId);
  }

  static async getAll(userId: number) {
    return prisma.note.findMany({
      where: { 
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } }
        ],
        status: 'active'
      },
      include: {
        tags: { include: { tag: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async getById(noteId: number, userId: number) {
    return prisma.note.findFirst({
      where: {
        id: noteId,
        OR: [
          { ownerId: userId },
          { shares: { some: { userId } } }
        ]
      },
      include: {
        tags: { include: { tag: true } },
        shares: { include: { user: { select: { id: true, name: true, email: true } } } }
      },
    });
  }

  static async update(noteId: number, userId: number, data: any) {
    const note = await prisma.note.findFirst({ where: { id: noteId, ownerId: userId } });
    if (!note) throw new Error('Заметка не найдена или нет прав');

    return prisma.note.update({
      where: { id: noteId },
      data: {
        title: data.title,
        content: data.content,
        color: data.color,
      },
    });
  }

  static async softDelete(noteId: number, userId: number) {
    const note = await prisma.note.findFirst({ where: { id: noteId, ownerId: userId } });
    if (!note) throw new Error('Заметка не найдена или нет прав');

    return prisma.note.update({
      where: { id: noteId },
      data: { status: 'trashed', deletedAt: new Date() },
    });
  }

  static async restore(noteId: number, userId: number) {
    return prisma.note.update({
      where: { id: noteId },
      data: { status: 'active', deletedAt: null },
    });
  }

  static async share(noteId: number, ownerId: number, targetEmail: string, role: string) {
    const note = await prisma.note.findFirst({ where: { id: noteId, ownerId } });
    if (!note) throw new Error('Заметка не найдена или нет прав');

    const targetUser = await prisma.user.findUnique({ where: { email: targetEmail } });
    if (!targetUser) throw new Error('Пользователь с таким email не найден');
    if (targetUser.id === ownerId) throw new Error('Нельзя поделиться заметкой с самим собой');

    return prisma.noteShare.upsert({
      where: { noteId_userId: { noteId, userId: targetUser.id } },
      update: { role },
      create: { noteId, userId: targetUser.id, role },
    });
  }
}