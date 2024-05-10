import React from 'react'
import AuthRegister from './AuthRegister';
import Login from './AuthLogin';
import useAuthStore from '../service/auth.store';
import Authanticated from '../Authanticated';
import UnAuthanticated from './UnAuthanticated';



const AuthComp = () => {

    const user = useAuthStore((state) => state.user);


    return (
        <div>
            <div className="flex justify-center items-center">
                { user?.id 
                    ? <Authanticated /> 
                    : <UnAuthanticated /> 
                }
            </div>
        </div>
    )
}

export default AuthComp
