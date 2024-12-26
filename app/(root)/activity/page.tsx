import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { featchUser,  getActivity } from "@/lib/actions/user.actions"
import Link from "next/link" 
import Image from "next/image"

const Page = async () => {
    const user = await currentUser()

    if (!user?.id) return null

    const userInfo = await featchUser(user.id)

    if (!userInfo) return null
    if (!userInfo?.onboarded) redirect('/onboarding')

    const activity = await getActivity(userInfo._id);

console.log('acivity: ', activity)

 

    
    return (
        <section >
            <h1 className="head-text mb-10">Activity</h1>
            <section className="mt-10 flex flex-col gap-5">
                {
                    activity && activity.length > 0 
                    ? activity.map(item=><Link key={item._id} href={`/thread/${item.parentId}`}>
                        <article className="activity-card">
                            <Image 
                            src={item.author.image} 
                            alt="profile picture" 
                            width={20} 
                            height={20} 
                            className="rounded-full object-cover"
                            />

                            <p className="text-small-regular text-light-1">
                                <span className="mr-1 text-primary-500">
                                    {item.author.name} 
                                </span>
                                replies to your thread 
                            </p>
                        </article>
                    </Link>)
                    : <p className="text-base-regular text-white">No Activity yet</p>
                }

            </section>
           
        </section>
    )
}

export default Page