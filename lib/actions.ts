'use server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type State = {
  error?: string | undefined
  success: boolean
}

export const addPostAction = async (prevState: State, formData: FormData): Promise<State> => {
  try {
    const { userId } = auth()

    if (userId === null) {
      return { error: 'ユーザーが存在しません', success: false }
    }
    const postText = (formData.get('post') as string) || ''
    const postTextSchema = z
      .string()
      .min(1, 'ポスト内容を入力してください。')
      .max(140, '140字以内で入力してください。')

    const validatedPostText = postTextSchema.parse(postText)

    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: userId,
      },
    })
    // Post を追加した後、キャッシュを再構築する
    revalidatePath('/')
    return { error: undefined, success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((error) => error.message).join(','), success: false }
    } else if (error instanceof Error) {
      return { error: error.message, success: false }
    } else {
      return { error: 'エラーが発生しました。', success: false }
    }
  }
}

export const likeAction = async (postId: string) => {
  const { userId } = auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    })
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      })
    }
    revalidatePath('/')
  } catch (error) {
    console.error(error)
  }
}
