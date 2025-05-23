import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import SetTitleFontFamily from './SetTitleFontFamily';
import SetTitleFontSize from './SetTitleFontSize';
import SetTitleBarColor from './SetTitleBarColor';
import SetVideoFilterType from './SetVideoFilterType';
import SetVideoFilterValue from './SetVideoFilterValue';
import SetVideoTransitionDelay from './SetVideoTransitionDelay';

function LeftSide(props) {
  const {config, updateConfig, runInitialAnimation} = props;
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <DialogContent>
      <DialogContentText sx={{ color: 'white' }}>
        <SetTitleFontFamily config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetTitleFontSize config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetTitleBarColor config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetVideoFilterType config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetVideoFilterValue config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetVideoTransitionDelay config={config} updateConfig={updateConfig} />
      </DialogContentText>
    </DialogContent>
  );
}

export default React.memo(LeftSide);
