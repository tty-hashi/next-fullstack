'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { useRef, useState } from 'react'
import { addPostAction } from '@/lib/actions'
import SubmitButton from './SubmitButton'

export default function PostForm() {
  const [error, setError] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    const result = await addPostAction(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setError('')
      if (formRef.current) {
        formRef.current.reset()
      }
    }
  }
  return (
    <div className=''>
      <div className='flex items-center gap-4'>
        <Avatar className='w-10 h-10'>
          <AvatarImage src='/placeholder-user.jpg' />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>

        <form action={handleSubmit} className='flex items-center flex-1' ref={formRef}>
          <Input
            type='text'
            placeholder="What's on your mind?"
            className='flex-1 rounded-full bg-muted px-4 py-2'
            name='post'
          />
          <SubmitButton />
        </form>
      </div>
      {error && <p className='text-destructive mt-1 ml-14'>{error}</p>}
    </div>
  )
}
