'use client'

import React, { useOptimistic } from 'react'
import { Button } from '../ui/button'
import { HeartIcon, MessageCircleIcon, Share2Icon } from './Icons'
import { likeAction } from '@/lib/actions'
import { useAuth } from '@clerk/nextjs'

type Props = {
  postId: string
  initialLikes: string[]
  commentCount: number
}

type LikeState = {
  likeCount: number
  isLiked: boolean
}

export default function PostInteraction({ postId, initialLikes, commentCount }: Props) {
  const { userId } = useAuth()
  const initState = {
    likeCount: initialLikes.length,
    isLiked: !!userId && initialLikes.includes(userId),
  }

  const [optimisticLike, addOptimisticLike] = useOptimistic<LikeState, void>(
    initState,
    (currentState) => ({
      likeCount: currentState.isLiked ? currentState.likeCount - 1 : currentState.likeCount + 1,
      isLiked: !currentState.isLiked,
    }),
  )

  const handleLikeSubmit = async () => {
    try {
      addOptimisticLike()
      await likeAction(postId)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='flex items-center '>
      <form action={handleLikeSubmit} method='post'>
        <Button variant='ghost' size='icon'>
          <HeartIcon
            className={`h-5 w-5 ${
              optimisticLike.isLiked ? 'text-destructive' : 'text-muted-foreground'
            }`}
            fill={optimisticLike.isLiked ? 'currentColor' : 'none'}
          />
        </Button>
      </form>
      <span className={`-ml-1 ${optimisticLike.isLiked ? 'text-destructive' : ''}`}>
        {optimisticLike.likeCount}
      </span>
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
