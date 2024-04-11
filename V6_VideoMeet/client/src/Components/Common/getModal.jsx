import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import GetMyProfile from '../Video Meet/getMyProfile';


export default function GetModal({showM}) {
  const [open, setOpen] = React.useState(false);

  if(showM){
    setOpen(true)
  }
  return (
    <React.Fragment>
      {/* <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        Open modal
      </Button> */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
       <GetMyProfile/>
      </Modal>
    </React.Fragment>
  );
}