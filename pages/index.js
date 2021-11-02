import Button from "@material-tailwind/react/Button";
import DocumentRow from "../components/DocumentRow";
import Head from 'next/head';
import Icon from "@material-tailwind/react/Icon";
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from "next/image";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import { addDoc, collection, doc, orderBy, onSnapshot, serverTimestamp, query, where, setDoc, getDocs, limit, startAfter } from "@firebase/firestore";
import { db } from "../firebase";
import { getSession, useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const [snap, setSnap] = useState([{ fileName: "Loading...", id: "initial" }]);
  const [searchTerm, setSearchTerm] = useState("");

  const getMoreDocs = async() => {
    const q = query(collection(db, "userDocs/", `${ session.user.email }`, "/docs"), orderBy("timestamp", "desc"), startAfter(lastDoc), limit(3));

    onSnapshot(q, (snapshot) => { 
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      snapshot.docs.map((doc) => setSnap(snap => [...snap, ({ ...doc.data(), id: doc.id })])); }
    );
  }

  async function updateDoc(session) {
    const q = query(collection(db, "userDocs/", `${ session.user.email }`, "/docs"), where("required", "!=", null), where("required", "==", false));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const results = snapshot.docs.map((doc) => ({ id: doc.id }))

      results.forEach((result) => {
        const docRef = doc(db, "userDocs/", `${ session.user.email }`, "/docs/", result.id);
        setDoc(docRef, { required: true }, { merge: true });
      });
    }
  }

  useEffect( 
    () => 
      { if (session) {
        updateDoc(session);

        const q = query(collection(db, "userDocs/", `${ session.user.email }`, "/docs"), orderBy("timestamp", "desc"), limit(3));
        onSnapshot(q, (snapshot) => { 
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
          setSnap(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))); }
        );
      }
    }, [ session ]
  );

  const createDocument = () => {
    if (!input || !session) return;

    addDoc(collection(db, "userDocs", `${ session.user.email }`, "docs"), {
      editorState: "",
      fileName: input, 
      timestamp: serverTimestamp(), 
      required: true,}
    );

    setInput("");
    setShowModal(false);
  };

  const modal = (
  <Modal size="sm" active={ showModal } toggler={ () => setShowModal(false) }>
    
    <ModalBody>
      <input 
        value={ input } 
        onChange={ (e) => setInput(e.target.value) } 
        type="text" 
        className="outline-none w-full" 
        placeholder="Enter name of the document" 
        onKeyDown={ (e) => e.key === "Enter" && createDocument() } 
      />
    </ModalBody>
    
    <ModalFooter>
      <Button color="orange" buttonType="link" onClick={ (e) => setShowModal(false) } ripple="dark">Cancel</Button>
      <Button color="orange" onClick={ createDocument } ripple="light">Create</Button>
    </ModalFooter>

  </Modal>
  );

  return (
    <div>

      <Head>
        <title>Online Document Viewer and Editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky top-0 z-50 flex items-center px-4 py-2 shadow-md bg-white">
        <Button color="gray" buttonType="outline" rounded={true} iconOnly={true} ripple="dark" className="h-20 w-20 border-0"><Icon name="menu" size="3xl" /></Button>
        <Icon name="description" size="5xl" color="orange" />
        <h1 className="ml-2 text-gray-700 text-2xl">Archive</h1>
        
        {session ? (
            <>
            <div className="mx-5 md:mx-20 flex flex-grow items-center px-5 py-2 bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md">
                <Icon name="search" size="3xl" color="gray" />
                <input type="text" placeholder="Search" className="flex-grow px-5 text-base bg-transparent outline-none" onChange={ (e) => { setSearchTerm(e.target.value); } } />
            </div>

            <Button color="gray" buttonType="outline" rounded={true} iconOnly={true} ripple="dark" className="ml-5 md:ml-20 h-20 w-20 border-0"><Icon name="apps" size="3xl" color="gray" /></Button>
            <img loading="lazy" onClick={ signOut } className="cursor-pointer h-12 w-12 rounded-full ml-2" src={session?.user?.image} alt="" />
            </>

        ) : (
            <>
            <div className="mx-5 md:mx-20 flex flex-grow items-center px-5 py-2 bg-gray-100 text-gray-600 rounded-lg focus-within:text-gray-600 focus-within:shadow-md">
                <Icon name="search" size="3xl" color="gray" />
                <input type="text" placeholder="Search" className="flex-grow px-5 text-base bg-transparent outline-none" />
            </div>

            <Button onClick={ signIn } buttonType="outline" color="orange" rounded={true} iconOnly={true} ripple="dark" className="ml-5 md:ml-20 h-20 w-20 border-0"> Sign In </Button>
            </>
        )}
        
        
    </header>

      { modal }

      <section className="bg-[#F8F9FA] pb-10 px-10">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center justify-between py-6">
            <h2 className="text-gray-700 text-lg">Create a new document</h2>
            <Button 
              color="gray" 
              buttonType="outline" 
              iconOnly={ true } 
              ripple="dark" 
              className="border-0"><Icon name="more_vert" size="3xl" />
            </Button>
          </div>

          <div>
            <div onClick={ () => setShowModal(true) } className="relative h-52 w-40 border-2 cursor-pointer hover:border-orange-700">
            <Image loading="lazy" src="https://us.123rf.com/450wm/kongvector/kongvector1810/kongvector181008581/110250917-finger-plus-sign-isolated-on-the-mascot-vector-illustration.jpg?ver=6" layout="fill" />
            </div>
            <p className="ml-2 mt-2 font-semibold text-sm text-gray-700"></p>
          </div>

        </div>
      </section> 

      <section className="bg-white px-10 md:px-0">
        <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
          
          <div className="flex items-center justify-between pb-5">
            <h2 className="font-medium flex-grow">My Documents</h2>
            <p className="mr-12">Date Created</p>
            <Icon name="folder" size="3xl" color="gray" />
          </div>

          <InfiniteScroll
            dataLength={ snap.length }
            next={ getMoreDocs }
            hasMore={ true }>
            {session ? snap.filter((val) => 
              {
                if (searchTerm == ""){
                  return val;
                }
                else if (val.fileName.toLowerCase().includes(searchTerm.toLowerCase())) {
                  return val;
                }
              }).map((doc) => (
              <DocumentRow 
                key={ doc.id } 
                id={ doc.id }
                email={ session.user.email } 
                fileName={ doc.fileName } 
                date={ doc.timestamp } 
              />
              )) : <></>
            }
          </InfiniteScroll>

        </div>
      </section>

    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
