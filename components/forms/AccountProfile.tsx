'use client'

import {
    Form,
    FormControl,
    FormDescription,
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
import { ChangeEvent } from "react";

const AccountProfile = ({ user, btnTitle }: Props) => {

    const form = useForm<z.infer<typeof UserValidation>>({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: '',
            name: '',
            username: '',
            bio: ''
        }
    })

    function onSubmit(values: z.infer<typeof UserValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    const handleImage = (e: ChangeEvent, fieldChage: (value: string) => void) => {
        e.preventDefault()

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
                                    className="acoount-form_image-input"
                                    type="file"
                                // {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile