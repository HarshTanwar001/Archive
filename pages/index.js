import Button from "@material-tailwind/react/Button";
import Head from 'next/head';
import Header from '../components/Header';
import Icon from "@material-tailwind/react/Icon";
import Image from "next/image";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");

  const createDocument = () => {
    if (!input) return;

    
  };

  const modal = (
  <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
    
    <ModalBody><input value={input} onChange={(e) => setInput(e.target.value)} type="text" className="outline-none w-full" placeholder="Enter name of the document" onKeyDown={(e) => e.key === "Enter" && createDocument()} /></ModalBody>
    
    <ModalFooter>
      <Button color="orange" buttonType="link" onClick={(e) => setShowModal(false)} ripple="dark">Cancel</Button>
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

      <Header />

      { modal }

      <section className="bg-[#F8F9FA] pb-10 px-10">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center justify-between py-6">
            <h2 className="text-gray-700 text-lg">Create a new document</h2>
            <Button color="gray" buttonType="outline" iconOnly={true} ripple="dark" className="border-0"><Icon name="more_vert" size="3xl" /></Button>
          </div>

          <div>
            <div onClick={() => setShowModal(true)} className="relative h-52 w-40 border-2 cursor-pointer hover:border-orange-700">
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

        </div>
      </section>

    </div>
  );
}

