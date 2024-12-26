import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { featchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const Page = async ({ params }: { params: { id: string; } }) => {

    if (!params.id) return null

    const user = await currentUser()

    if (!user) return null


    const userInfo = await featchUser(user.id)

    if (!userInfo?.onboarded) redirect('/onboarding')


    const thread = await fetchThreadById(params.id)


    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    content={thread.text}
                    currectUserId={user.id}
                    parentId={thread.parentId}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={userInfo._id}
                />
            </div>

            <div className="mt-10 *:mb-2">
                {
                    thread.children.map((item) => (
                        <ThreadCard
                            key={item._id}
                            id={item._id}
                            content={item.text}
                            currectUserId={user.id}
                            parentId={item.parentId}
                            author={item.author}
                            community={item.community}
                            createdAt={item.createdAt}
                            comments={item.children}
                            isComment
                        />
                    ))
                }
            </div>

        </section>
    )
}

export default Page 