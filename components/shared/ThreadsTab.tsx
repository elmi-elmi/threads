import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

type Props = {
    currentUserId: string;
    accountId: string;
    accountType: string;
}
const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {

    const result = await fetchUserPosts(accountId)

    if (!result) redirect('/')

    return (
        <section className="mt-9 flex flex-col gap-10">
            {
                // @ts-expect-error this is the description
                result.threads.map((thread) => ( 
                    <ThreadCard
                        key={thread._id}
                        id={thread._id}
                        content={thread.text}
                        currectUserId={currentUserId}
                        parentId={thread.parentId}
                        author={accountType === "User"
                            ? { name: result.name, image: result.image, id: result.id }
                            : { name: thread.author.name, image: thread.authr.image, id: thread.author.id }
                        } 
                        community={thread.community}
                        createdAt={thread.createdAt}
                        comments={thread.children}
                    />
                ))
            }
        </section>
    )
}


export default ThreadsTab