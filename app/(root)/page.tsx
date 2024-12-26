import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { featchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  try {
    const user = await currentUser()

    if (!user?.id) return redirect('/sign-in')

    const userInfo = await featchUser(user.id)

    if (!userInfo) return redirect('/onboarding')

    const {  posts } = await fetchPosts(1, 30)



    return (
      <>
        <h1 className="head-text text-start">Home</h1>
        <section className="mt-0 flex flex-col gap-10">
          {
            posts.length === 0
              ? (<p className="no-resutl">No threads found</p>)
              : posts.map(post => <ThreadCard
                key={post._id}
                id={post._id}
                content={post.text}
                currectUserId={user.id}
                parentId={post.parentId}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}

              />)
          }

        </section>
      </>
    );

  } catch (error) {
    console.log(error)
    redirect('/onboarding')
  }

} 
