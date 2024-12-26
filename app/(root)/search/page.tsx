import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import UserCard from "@/components/cards/UserCard"
import { featchUser, fetchUsers } from "@/lib/actions/user.actions"

const Page = async () => {
    const user = await currentUser()

    if (!user?.id) return null

    const userInfo = await featchUser(user.id)

    if (!userInfo) return null
    if (!userInfo?.onboarded) redirect('/onboarding')

    const result = await fetchUsers({
        userId: user.id,
    })

    
    return (
        <section >
            <h1 className="head-text mb-10">Search</h1>
            <div className="mt-14 flex flex-col gap-9">
                {
                    result?.users.length === 0
                        ? <p className="">No users</p>
                        : <>
                            {
                                result?.users.map(person => (
                                    <UserCard key={person.id} name={person.name} id={person.id} username={person.username} imgUrl={person.image} personType="User" />
                                ))
                            }
                        </>
                }
            </div>
        </section>
    )
}

export default Page