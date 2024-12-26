"use server";

import { revalidatePath } from "next/cache";


import User from "../models/user.model";

import { connectToDB } from "../mongoose"; 
import Thread from "@/lib/models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";


interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {

   
  try { 
    console.log('try start 1')
    await connectToDB();
    console.log('find 2..........')
    

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true } 
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: unknown) { 
    if(error instanceof Error) throw new Error(`Failed to create/update user: ${error.message}`);
    console.log(error)
    throw new Error('Failed to create/update user: Unknown Error:')
  }
} 

export async function featchUser(userId: string){
    try{
        connectToDB()

        return await User
        .findOne({id: userId})
    }catch(error:unknown){
        if(error instanceof Error){
            throw new Error(`Failed to fetch user: ${error.message}`)
        } 
        console.log(error)
        throw new Error('Failed to fetch user: Unknown error occured')
    }
}



export async function fetchUserPosts(userId: string){
  try{
    connectToDB()

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: 
        { 
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      
    });
    return threads;

  }catch(error){
    if(error instanceof Error) throw new Error(`Failed to fetch user posts: ${error.message}`)
      console.log(error)
  }
}

export async function fetchUsers ( 
  {userId, searchString="",  pageNumber=1, pageSize=20, sortBy = "desc"}:{
  userId: string,
  searchString?: string;
  pageNumber?:number;
  pageSize?:number;
  sortBy?: SortOrder
}){
  try{
    connectToDB()
    const skipAmount = (pageNumber - 1 ) * pageSize
    const regex = new RegExp(searchString, "i")

    const query: FilterQuery<typeof User> = {
      id: {$ne: userId}
    } 

    if(!!searchString.trim()) {
      query.$or = [
        {username: {$regex: regex}},
        {name: {$regex: regex}}
      ]
    }

    const sortOptions = {createdAt: sortBy}


    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
  const totalUserCount = await User.countDocuments(query)
  const users = await usersQuery.exec()

  const isNext = totalUserCount > skipAmount + users.length
  return {users, isNext} 
} 
  catch(error){
  if(error instanceof Error) throw new Error(`Failed to fetch users: ${error.message}`)
      console.log(error)
  }
}

export async function getActivity(userId: string){
  try{
    const userThreads = await Thread.find({author: userId})
    
    const childrenIds = userThreads.reduce((acc, userThread)=> acc.concat(userThread.children), [])
    
    const replies = await Thread.find({
      _id: {$in: childrenIds},
      author: {$ne: userId}
    }) 
    .populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    })

    return replies

  }catch(error){
    if(error instanceof Error) throw new Error(`Failed to fetch activity: ${error.message}`)
    console.log(error)
  }
}