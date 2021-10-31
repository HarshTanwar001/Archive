import dynamic from "next/dynamic";
import { convertFromRaw, convertToRaw } from "draft-js";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "@firebase/firestore";
import { EditorState } from "draft-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(() => import("react-draft-wysiwyg").then((module) => module.Editor), { ssr: false, });

function TextEditor() {
    const { data: session } = useSession();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (session) {
            if (performance.getEntriesByType("navigation").map((nav) => nav.type).includes('reload')){
                const docRef = doc(db, "userDocs/", `${ session.user.email }`, "/docs/", `${ id }`);
                const payload = { 
                    required: true 
                };
        
                setDoc(docRef, payload, { merge: true });
            }

            onSnapshot(doc(db, "userDocs/", `${ session.user.email }`, "/docs/", `${ id }`), (doc) => {
                try {
                    if (doc.data().required && doc.data().editorState){
                        setEditorState(
                            EditorState.createWithContent(
                                convertFromRaw(doc.data().editorState)
                            )
                        );
                    }
                }
                catch (error){}
            });
        }
    }, [ session ]);
    
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);

        const docRef = doc(db, "userDocs/", `${ session.user.email }`, "/docs/", `${ id }`);
        const payload = { 
            editorState: convertToRaw(editorState.getCurrentContent()), 
            required: false 
        };

        setDoc(docRef, payload, { merge: true });
    };

    return (
        <div className="bg-[#F8F9FA] h-screen pb-64">
            <Editor
                editorState={ editorState } 
                onEditorStateChange={ onEditorStateChange }
                toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
                editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border" 
            />
        </div>
    );
}

export default TextEditor;
