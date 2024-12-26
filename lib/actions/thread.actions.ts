'use server'

import Thread from "@/lib/models/thread.model"
import User from "@/lib/models/user.model"
import { connectToDB } from "@/lib/mongoose"
import { revalidatePath } from "next/cache" 

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}
export async function createThread({text, author,  path}: Params){
    await connectToDB()
    
    try { 
        const createThread = await Thread.create({
            text,
            author, 
            community: null
        })    
    
        await User.findByIdAndUpdate(author, {
            $push: {threads: createThread._id}
        }) 
    
        revalidatePath(path)

    }catch(error){
        console.log(error)
    }

}

export async function fetchPosts(pageNumber=1, pageSize=20){
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize
   

    const postsQuery = Thread
    .find({parentId: {$in:[null, undefined]}})

    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate(
        {
            path: 'author',
            model: User
        }
    )
    .populate(
        {
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: '_id name parentId image'
            }

        }
    )

    const totalPostsCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})



    const posts = await postsQuery.exec()

    const isNext = totalPostsCount > skipAmount + posts.length
    return {posts,isNext }
}


export async function fetchThreadById(id: string){
    connectToDB()


    try{
        const thread = await Thread.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: 'children',
            populate:[
                {
                    path: 'author',
                    model: User,
                    select: '_id id name parent image'
                },
                {
                    path: 'children', 
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                } 
            ]
        }).exec()

        return thread

    }catch(error){ 
        if(error instanceof Error) throw new Error(`Error fetching thread: ${error.message}`)
            console.error(error) 
    }
}



export async function addCommentToThread(
  {threadId, commentText, userId, path}:{
    threadId: string,
    commentText: string,
    userId: string,
    path: string
  }
){ 
    connectToDB()

    try{

        const originalThread = await Thread.findById(threadId)

        if(!originalThread) throw new Error('Thread not found')
        
        const comment = new Thread({
            parentId: threadId,
            text: commentText,
            author: userId
        })
        
        const savedComment = await comment.save()

        originalThread.children.push(savedComment._id)

        await originalThread.save() 

        revalidatePath(path)

    }catch(error){
        if(error instanceof Error) throw new Error(`Error adding comment to thread: ${error.message}`)
        console.log(error) 
    }

}