import React, { FormEvent } from 'react'
import { publicAxios, parseAuthResponse } from '../service/axios.config';
import useAuthStore from '../service/auth.store';


const AuthRegister = () => {

    const [formData, setFormData] = React.useState({ email: '', password: '' })
    const setUser = useAuthStore((state) => state.setUser);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        publicAxios.post('/auth/create', formData)
            .then((res) => {
                if (res.status === 200) setUser(parseAuthResponse(res));
            })
            .catch((err) => console.error(err.response.data))
    }

    return (
        <div>
            <div className='mt-16'>
            <h1 className="text-2xl font-bold text-slate-200 mb-4 text-center">Register</h1>

                <form onSubmit={onSubmit} className='flex flex-col items-center justify-center gap-4'>
                    <input type={"email"} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <input type={"password"} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    <div className='w-full'>
                        <button className='bg-green-600 px-4 py-1 rounded-md text-white w-full' type='submit'>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthRegister