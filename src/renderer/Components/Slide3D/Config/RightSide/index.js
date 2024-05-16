import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import SetUseTitleBar from './SetUseTitleBar';
import SetButtonFontSize from './SetButtonFontSize';
import SetButtonWidth from './SetButtonWidth';
import SetSeekZero from './SetSeekZero';
import SetAutoPlay from './SetAutoPlay';
import SetIdleVideoWidth from './SetIdleVideoWidth';
import SetVideoGreyWhenDone from './SetVideoGreyWhenDone';
import SetVideoGreyWhenAllDone from './SetVideoGreyWhenAllDone';
import SetRotationTimeLast from './SetRotationTimeLast';

function RightSide(props) {
  const {config, updateConfig} = props;
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <DialogContent>
      <DialogContentText sx={{ color: 'white' }}>
        <SetUseTitleBar config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetButtonFontSize config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetButtonWidth config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <p></p>
      <DialogContentText sx={{ color: 'white' }}>
        <SetSeekZero config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetAutoPlay config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetVideoGreyWhenDone config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetIdleVideoWidth config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetVideoGreyWhenAllDone config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetRotationTimeLast config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <p></p>
    </DialogContent>
  );
}

export default React.memo(RightSide);