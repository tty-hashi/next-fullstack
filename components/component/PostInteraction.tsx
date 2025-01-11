import React from 'react'
import { Button } from '../ui/button'
import { HeartIcon, MessageCircleIcon, Share2Icon } from './Icons'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

type Props = {
  postId: string
  initialLikes: string[]
  commentCount: number
}

const PostInteraction: React.FC<Props> = ({ postId, initialLikes, commentCount }) => {
  const likeAction = async () => {
    'use server'

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

  return (
    <div className='flex items-center '>
      <form action={likeAction}>
        <Button variant='ghost' size='icon'>
          <HeartIcon className='h-5 w-5 text-muted-foreground' />
        </Button>
      </form>
      <span className='-ml-1'>{initialLikes.length}</span>
      <Button variant='ghost' size='icon'>
        <MessageCircleIcon className='h-5 w-5 text-muted-foreground' />
      </Button>
      <span className='-ml-1'>{commentCount}</span>
      <Button variant='ghost' size='icon'>
        <Share2Icon className='h-5 w-5 text-muted-foreground' />
      </Button>
    </div>
  )
}

export default PostInteraction
