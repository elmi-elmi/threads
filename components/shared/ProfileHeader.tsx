import Image from "next/image";

type Props = {
    accountId: string;
    authUserId: string;
    name: string;
    imgUrl: string;
    bio: string;
    username: string;
}
const ProfileHeader = (
    {
        accountId,
        authUserId,
        name,
        imgUrl,
        bio,
        username
    }: Props) => {

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex gap-2 items-center  justify-between">
                <div className="relative flex size-20 items-center gap-3">
                    <div>
                        <Image src={imgUrl} fill alt="Profile Image" className="rounded-full object-cover shadow-2xl" />
                    </div>
                </div>
                <div className="flex-1 ">
                    <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                    <p className="text-base-medium text-gray-1">@{username}</p>
                </div>
            </div>





            <p className="mt-6 text-base-regular max-w-lg text-light-2">{bio}</p>

            <div className="mt-12 h-0.5 w-full bg-dark-4" />


        </div>
    )
}

export default ProfileHeader 