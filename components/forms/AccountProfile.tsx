'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { UserValidation } from "@/lib/validations/user";

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;

    };
    btnTitle: string;
}
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

const AccountProfile = ({ user }: Props) => {
    const pathname = usePathname()
    const router = useRouter()

    const { startUpload } = useUploadThing("media")
    const [files, setFiles] = useState<File[]>([])

    const form = useForm<z.infer<typeof UserValidation>>({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || ''
        }
    })


    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault()

        const fileReader = new FileReader()

        if (!!e?.target?.files?.length) {
            const file = e.target.files[0]

            setFiles(Array.from(e.target.files))

            if (!file.type.includes('image')) return

            fileReader.onload = async (event) => {

                const imageDataUrl = event.target?.result?.toString() || ''
                fieldChange(imageDataUrl)
            }

            fileReader.readAsDataURL(file)
        }

    }


    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        const blob = values.profile_photo;

        const hasImageChanges = isBase64Image(blob)
        if (hasImageChanges) {
            const imgRes = await startUpload(files)

            if (imgRes && imgRes[0].url) {
                values.profile_photo = imgRes[0].url
            }
        }


        await updateUser(
            {
                path: pathname,
                userId: user.id,
                bio: values.bio,
                name: values.name,
                username: values.username,
                image: values.profile_photo,
            }
        )

        if (pathname === '/profile/edit') {
            router.back()
        } else {
            router.push('/')
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-around gap-10"
            >
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="account-form_image-label">
                                {
                                    field.value ? <Image src={field.value}
                                        alt="profile photo"
                                        height={96}
                                        width={96}
                                        priority
                                        className="rounded-full object-contain"
                                    /> : <Image
                                        src={'/assets/profile.svg'}
                                        alt="profile photo"
                                        height={24}
                                        width={24}
                                        priority
                                        className="object-contain"
                                    />
                                }
                            </FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-200">
                                <Input
                                    onChange={(e) => handleImage(e, field.onChange)}
                                    placeholder="Upload a photo"
                                    className="account-form_image-input"
                                    type="file"
                                // {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="name"
                                    className="account-form_input no-focus"
                                    type="text"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="username"
                                    className="account-form_input no-focus"
                                    type="text"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    placeholder="Biography"
                                    className="account-form_input no-focus"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-primary-500">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile