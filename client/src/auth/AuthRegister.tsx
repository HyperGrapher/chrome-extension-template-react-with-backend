import { publicAxios, parseAuthResponse } from '@/service/axios.config';
import useAuthStore from '@/service/auth.store';
import { Button } from '@/components/ui/button';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
    email: z.string().email({
        message: "Must be a valid email.",
    }),
    password: z.string().min(8, {
        message: "Must be at least 8 characters.",
    }).max(128, {
        message: "Must be maximum 128 characters.",
    }),
})


const AuthRegister = () => {

    const setUser = useAuthStore((state) => state.setUser);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        publicAxios.post('/auth/create', values)
            .then((res) => {
                if (res.status === 200) setUser(parseAuthResponse(res));
            })
            .catch((err) => {

                if (err.response.data.errType.includes('email')) {
                    form.setError('email', {
                        message: err.response.data.message,
                    })
                }
                if (err.response.data.errType.includes('password')) {
                    form.setError('password', {
                        message: err.response.data.message,
                    })
                }
            })
    }

    return (
        <div className='w-full'>
            <h1 className="text-2xl font-bold text-slate-200 mb-4 text-center">Register</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-64'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel className='text-zinc-400'>Email</FormLabel>
                                <FormControl>
                                    <Input className='text-zinc-200' placeholder="Email" {...field} type='email' />
                                </FormControl>
                                <FormMessage className='absolute text-[0.7rem]' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel className='text-zinc-400'>Password</FormLabel>
                                <FormControl>
                                    <Input className='text-zinc-200' placeholder="Password" {...field} type='password' />
                                </FormControl>
                                <FormMessage className='absolute text-[0.7rem]' />
                            </FormItem>
                        )}
                    />

                    <div className='w-full pt-2'>
                        <Button className='w-full' type='submit'>Register</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AuthRegister