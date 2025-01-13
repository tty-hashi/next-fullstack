import prisma from '@/lib/prisma'

export const postDataFetcher = async (userId: string, username?: string) => {
  if (userId === null) return
  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  })
  const followingIds = following.map((f) => f.followingId)
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: username ? [userId] : [userId, ...followingIds],
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
