import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server"
import PostThread from "@/components/forms/PostThread";
import { featchUser } from "@/lib/actions/user.actions";


async function Page() {
    const user = await currentUser()
    if (!user) return null;
    const userInfo = await featchUser(user.id)
    if (!userInfo?.onboarded) redirect('/onboarding')
    return (
        <>
            <h1 className="head-text">Creatge Thread</h1>
            <PostThread userId={userInfo._id} />
        </>
    )
}

export default Page