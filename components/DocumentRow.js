import Button from "@material-tailwind/react/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Icon from "@material-tailwind/react/Icon";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import { addDoc, collection, deleteDoc, doc, getDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/dist/client/router"
import { useState } from "react";
import { makeStyles } from '@mui/styles';

const styles = makeStyles ({
  select: {
    backgroundColor: 'orange',
    borderRadius: '15px',
  }, 
  
  item: {
    '&:focus': {
      backgroundColor: 'orange',
    },
  },

});

function DocumentRow({ id, fileName, date, email }){
    const [delModal, setDelModal] = useState(false);
    const [input, setInput] = useState("");
    const [re_Modal, setRe_Modal] = useState(false);
    const router = useRouter();
    const usestyles = styles();

    const deleteDocument = async() => { 
        await deleteDoc(doc(db, "userDocs/", `${ email }`, "/docs/", `${ id }`));
        setDelModal(false);
    };

    const renameDocument = async() => {
        if (!input) return;

        const snapshot = await getDoc(doc(db, "userDocs/", `${ email }`, "/docs/", `${ id }`));
        
        if (!snapshot.empty) {
            addDoc(collection(db, "userDocs/", `${ email }`, "/docs"), {
                required: true,
                editorState: snapshot.data().editorState,
                fileName: input, 
                timestamp: snapshot.data().timestamp, }
            );

            await deleteDoc(doc(db, "userDocs/", `${ email }`, "/docs/", `${ id }`));
        }
        
        setInput("");
        setRe_Modal(false);
    };

    const modal = (
        <Modal size="regular" active={ delModal } toggler={ () => setDelModal(false) }>
          
          <ModalBody>
            <p className="outline-none w-full">Are you sure you want to delete the document titled "{ fileName }" ?</p>
          </ModalBody>
          
          <ModalFooter>
            <Button color="orange" buttonType="link" onClick={ () => setDelModal(false) } ripple="dark">Cancel</Button>
            <Button color="orange" onClick={ deleteDocument } ripple="light">Delete</Button>
          </ModalFooter>
      
        </Modal>
    );

    const re_modal = (
        <Modal size="regular" active={ re_Modal } toggler={ () => setRe_Modal(false) }>
          
          <ModalBody>
            <input 
              value={ input } 
              onChange={ (e) => setInput(e.target.value) } 
              type="text" 
              className="outline-none w-full" 
              placeholder={ fileName }
              onKeyDown={ (e) => e.key === "Enter" && renameDocument() } 
            />
            <p></p>
          </ModalBody>
          
          <ModalFooter>
            <Button color="orange" buttonType="link" onClick={ () => setRe_Modal(false) } ripple="dark">Cancel</Button>
            <Button color="orange" onClick={ renameDocument } ripple="light">Rename</Button>
          </ModalFooter>
      
        </Modal>
    );

    return(
        <div className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer">

            { modal }
            { re_modal }

            <div className="hidden md:inline-flex">
              <Icon onClick={ () => router.push(`/doc/${id}`) } name="article" size="3xl" color="orange" />
            </div>
            
            <p onClick={ () => router.push(`/doc/${id}`) } className="flex-grow md:pl-5 pl-1 w-10 pr-10 truncate">{ fileName }</p>
            <p onClick={ () => router.push(`/doc/${id}`) } className="pr-5 text-sm">{ date?.toDate().toLocaleDateString() }</p>

          <Dropdown>
            <Dropdown.Toggle className={ usestyles.select } variant="" id="dropdown-basic" size="sm"></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className={ usestyles.item } href="#" onClick={ () => setDelModal(true) }>Delete</Dropdown.Item>
              <Dropdown.Item className={ usestyles.item } href="#" onClick={ () => setRe_Modal(true) }>Rename</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
    );
}

export default DocumentRow;
