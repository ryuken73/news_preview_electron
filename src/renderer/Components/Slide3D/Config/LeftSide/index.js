import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import SetAutoRotate from './SetAutoRotate';
import SetMoveUpward from './SetMoveUpward';
import SetScaleOrigin from './SetScaleOrigin';
import SetVideoScale from './SetVideoScale';
import SetItemRadius from './SetItemRadius';
import SetAnimationTime from './SetAnimationTime';
import SetStartWithStacked from './SetStartWithStacked';
import SetDegreeOfLast from './SetDegreeOfLast';

import SetTitleType from './SetTitleType';
import SetTitleFontSize from './SetTitleFontSize';
import SetTitleFontWeight from './SetTitleFontWeight';
import SetTitleOpacity from './SetTitleOpacity';
import SetTitleStyle from './SetTitleStyle';

function LeftSide(props) {
  const {config, updateConfig, runInitialAnimation} = props;
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <DialogContent>
      <DialogContentText sx={{ color: 'white' }}>
        <SetAutoRotate config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetMoveUpward config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetVideoScale config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetScaleOrigin config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetItemRadius config={config} updateConfig={updateConfig} runInitialAnimation={runInitialAnimation} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetAnimationTime config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetStartWithStacked config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetDegreeOfLast config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <p></p>
      <DialogContentText sx={{ color: 'white' }}>
        <SetTitleType config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetTitleFontSize config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetTitleFontWeight config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetTitleOpacity config={config} updateConfig={updateConfig} />
      </DialogContentText>
      <DialogContentText sx={{ color: 'white' }}>
        <SetTitleStyle config={config} updateConfig={updateConfig} />
      </DialogContentText>

    </DialogContent>
  );
}

export default React.memo(LeftSide);