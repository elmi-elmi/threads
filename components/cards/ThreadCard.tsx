import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";


interface Props {
    id: string;
    currectUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community?: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    isComment?: boolean
}
const ThreadCard = ({
    id,
    content, author, comments,
     isComment 
}: Props) => {


    return (
        <article className={cn("flex py-1 w-full flex-col rounded-xl bg-dark-4 "
            , isComment ? 'px-0 xs:px-7 ' : ''
        )}>
            <div className="flex items-start justify-between gap-1">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image src={author.image} alt="profile photo" fill className="cursor-pointer rounded-full" />
                        </Link>
                    </div>
                </div>

                <div className="thread-card_bar" />
                <div className="flex w-full flex-col">
                    <Link href={`/profile/${author.id}`} className="w-fit">
                        <h4 className="cursor-pointer text-base-semibold text-light-1">
                            {author.name}
                        </h4>
                    </Link>


                    <p className="mt-2 text-small-regular text-light-2">{content}</p>
                   
                   
                    <div className={cn("mt-5 flex flex-col gap-3", isComment && "mb-10")}>
                        <div className="flex gap-3.5">

                            <Image src="/assets/heart-gray.svg" alt="heart"
                                width={24} height={24}
                                className="cursor-pointer object-contain"
                            />

                            <Link href={`/thread/${id}`}>
                                <Image src="/assets/reply.svg" alt="heart"
                                    width={24} height={24}
                                    className="cursor-pointer object-contain"
                                />
                            </Link>

                            <Image src="/assets/repost.svg" alt="heart"
                                width={24} height={24}
                                className="cursor-pointer object-contain"
                            />

                            <Image src="/assets/share.svg" alt="heart"
                                width={24} height={24}
                                className="cursor-pointer object-contain"
                            />


                        </div>
                        {
                            isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>

        </article >
    )
}

export default ThreadCard