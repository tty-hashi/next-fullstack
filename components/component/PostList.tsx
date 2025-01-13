import { postDataFetcher } from '@/lib/postDataFetcher'
import { auth } from '@clerk/nextjs/server'
import Post from './Post'

export default async function PostList({ username }: { username?: string }) {
  const { userId } = auth()

  if (userId === null) return

  const posts = await postDataFetcher(userId, username)

  return (
    <div className='space-y-4'>
      {posts?.length === 0 ? (
        <p>投稿がありません</p>
      ) : (
        posts?.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  )
}
