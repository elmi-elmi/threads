import AccountProfile from "@/components/forms/AccountProfile"
import { featchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


async function Page() {
    const user = await currentUser()
     if (!user?.id) return redirect('/sign-in')
 
     const userInfo = await featchUser(user.id)

    if (!userInfo) return redirect('/onboarding')

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl,

    }
    return (
        <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
            <h1 className='head-text'>Onboarding</h1>
            <p className='mt-3 text-base-regular text-light-2'>
                Complete your profile now, to use Threds.
            </p>

            <section className='mt-9 bg-dark-2 p-10'>
                <AccountProfile user={userData} btnTitle='Continue' />
            </section>
        </main>
    )
}

export default Page