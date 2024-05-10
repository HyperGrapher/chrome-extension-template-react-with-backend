import useAuthStore from './service/auth.store';

const Authanticated = () => {

    const user = useAuthStore((state) => state.user);

    return (
        <div className=''>

            <section className="">
                <div className="text-slate-200">{user?.email}</div>
                <button
                    className="bg-slate-800 text-slate-200 px-4 py-2 rounded-md"
                    onClick={() => useAuthStore.getState().logout()}
                >
                    Logout
                </button>

            </section>


        </div>
    )
}

export default Authanticated