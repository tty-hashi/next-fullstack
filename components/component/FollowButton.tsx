'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { followAction } from '@/lib/actions'

type Props = {
  userId: string
  isCurrentUser: boolean
  isFollowing: boolean
}

const FollowButton: React.FC<Props> = ({ userId, isCurrentUser, isFollowing }) => {
  const getButtonContent = () => {
    if (isCurrentUser) return 'プロフィール編集'
    if (isFollowing) return 'フォロー中'
    return 'フォローする'
  }

  const getButtonVariant = () => {
    if (isCurrentUser) return 'secondary'
    if (isFollowing) return 'outline'
    return 'default'
  }

  return (
    <form action={followAction.bind(null, userId)}>
      <Button variant={getButtonVariant()} className='w-full'>
        {getButtonContent()}
      </Button>
    </form>
  )
}

export default FollowButton
