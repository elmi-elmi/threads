'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";


const UserCard = ({id, name, username, imgUrl}:{id: string; name:string;username:string;imgUrl:string;personType:string;})=>{
    const router = useRouter() 
    console.log(id, name, username)
    return (
        <article className="user-card">
            <div className="user-card_avatar">
                <Image src={imgUrl} alt="logo" width={48} height={48} className="rounded-full"/>
                <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">
                        @{username}
                    </p>
                </div>
            </div>

            <Button
            onClick={()=> router.push(`/profile/${id}`)}
            className="user-card_btn">View</Button>
        </article>
    )
}

export default UserCard