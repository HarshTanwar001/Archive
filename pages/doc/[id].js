import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import TextEditor from "../../components/TextEditor";
import { db } from "../../firebase";
import { doc, getDoc } from "@firebase/firestore";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/dist/client/router"

function Doc() {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const [snapshot, setSnapshot] = useState([]);

    if (session) {
        (async function getDocuments() {
            const docRef = doc(db, "userDocs/", `${ session.user.email }`, "/docs/", `${ id }`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setSnapshot(docSnap.data());
            }
            
        }());
    }

    return (
        <div>
            <header className="flex justify-between items-center p-3 pb-1">
                <span onClick={ () => router.push("/") } className="cursor-pointer">
                    <Icon name="description" size="5xl" color="orange" /> 
                </span>

                <div className="flex-grow px-2">
                    <h2>{ snapshot.fileName }</h2>
                </div>

                <Button 
                    color="orange" 
                    buttonType="filled" 
                    size="regular" 
                    className="hidden md:inline-flex h-10" 
                    rounded={ false } 
                    block={ false } 
                    iconOnly={ false } 
                    ripple="light">
                    <Icon name="people" size="md"/> SHARE
                </Button>

                <img
                    loading="lazy" 
                    className="cursor-pointer rounded-full h-10 w-10 ml-2" 
                    src={ session?.user?.image } 
                    alt="" 
                />

            </header>

            <TextEditor />

        </div>
    );
}

export default Doc;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
}
