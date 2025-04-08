import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

function LeftSide(props) {
  const {config, updateConfig, runInitialAnimation} = props;
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <DialogContent>
      <DialogContentText sx={{ color: 'white' }}>
      </DialogContentText>
    </DialogContent>
  );
}

export default React.memo(LeftSide);
