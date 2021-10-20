import { getProviders, signIn as Sign_In } from "next-auth/react";

function signIn( { providers } ) {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 px-14 text-center">
                <img className="w-80" src="https://icon-library.com/images/148861559d.png" alt="" />
                <div className="mt-40 mb-10">
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                        <button className="p-3 bg-orange-500 rounded-lg text-white" onClick={() => Sign_In(provider.id, { callbackUrl: "/" })}> Sign in with {provider.name}</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(){
    const providers = await getProviders();

    return {
        props: {
            providers,
        },
    };
}

export default signIn;
