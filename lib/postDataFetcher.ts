import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export const postDataFetcher = async (userId: string) => {
  if (userId === null) return

  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: [userId],
      },
    },
    include: {
      author: true,
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return posts
}
