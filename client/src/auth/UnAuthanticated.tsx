import React from 'react'
import useAuthStore from '../service/auth.store';
import AuthLogin from './AuthLogin';
import AuthRegister from './AuthRegister';

const UnAuthanticated = () => {

    const [isLogin, setIsLogin] = React.useState(true)


    return (
        <div className=''>
            {isLogin ? <AuthLogin /> : <AuthRegister />}


            <button className='text-sky-400 text-center mt-4' onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Register" : "Login"}</button>
            
        </div>
    )
}

export default UnAuthanticated