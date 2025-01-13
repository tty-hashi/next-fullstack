'use client'
import React, { useOptimistic } from 'react'
import { Button } from '@/components/ui/button'
import { followAction } from '@/lib/actions'

type Props = {
  userId: string
  isCurrentUser: boolean
  isFollowing: boolean
}

const FollowButton: React.FC<Props> = ({ userId, isCurrentUser, isFollowing }) => {
  const [optimisticFollow, andOptimisticFollow] = useOptimistic<{ isFollowing: boolean }, void>(
    {
      isFollowing,
    },
    (currentState) => ({
      isFollowing: !currentState.isFollowing,
    }),
  )

  const getButtonContent = () => {
    if (isCurrentUser) return 'プロフィール編集'
    if (optimisticFollow.isFollowing) return 'フォロー中'
    return 'フォローする'
  }

  const getButtonVariant = () => {
    if (isCurrentUser) return 'secondary'
    if (optimisticFollow.isFollowing) return 'outline'
    return 'default'
  }

  const handleFollowAction = async () => {
    if (isCurrentUser) return

    try {
      andOptimisticFollow()
      await followAction(userId)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form action={handleFollowAction}>
      <Button variant={getButtonVariant()} className='w-full'>
        {getButtonContent()}
      </Button>
    </form>
  )
}

export default FollowButton
