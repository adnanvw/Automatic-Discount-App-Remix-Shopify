import {Button, Modal, TextContainer} from '@shopify/polaris';
import {useSelector,useDispatch} from "react-redux"
import { closeModal } from '../redux/modalRedux';


// import { useNavigate } from '@shopify/app-bridge-react';

export default function ModalExample({handleDelete}) {
  
  const {status,content,btnContent,action,id}=useSelector(state=>state.modal)

  const dispatch=useDispatch()
  // const navigate=useNavigate()
  
  const handleChangeClose = ()=>{
      dispatch(closeModal())
  }

  // console.log(handleDelete)
  const handleChangeAction=()=>{
     if(action=="delete"){
        handleDelete(id)
        handleChangeClose()
     }
  }
  return (
    <div style={{height: '500px',display:!status?"none":"block"}}>
      <Modal
        instant
        open={status}
        onClose={handleChangeClose}
        title="Are You Sure ?"
        primaryAction={{
          content: btnContent,
          onAction: handleChangeAction,
          destructive:true,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleChangeClose,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              {content}
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}