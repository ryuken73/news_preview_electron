import * as React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import version from '../../../version';

const CustomDialog = styled(Dialog)`
  z-index: 25000 !important;
  div.MuiDialog-container {
    div.MuiPaper-root {
      background: black;
      opacity: 0.5;
      color: white;
      max-width: 1200px;
      width: 1000px;
      border: 1px white solid;
      border-radius: 10px;
    }
  }
`
const Container = styled.div`
  display: flex;
`
const StyledSpan = styled.button`
  cursor: pointer;
  margin-left: 10px;
`
const Version = styled.span`
  margin-left: 10px;
  font-size: 15px;
  opacity: 0.6;
`
const ConfigDialog = props => {
  console.log(props)
  const { 
    configDialogOpen, 
    toggleDialogOpen ,
    config, 
    setConfig,
    saveToLocalStorage,
    defaultConfig,
    updateConfig,
    runInitialAnimation
  } = props;

  const handleYes = React.useCallback(() => {
    toggleDialogOpen();
  }, [toggleDialogOpen]);

  const setConfigDefault = React.useCallback(() => {
    setConfig(defaultConfig);
    saveToLocalStorage(defaultConfig);
  }, [defaultConfig, saveToLocalStorage, setConfig])

  return (
      <CustomDialog open={configDialogOpen} onClose={handleYes}>
        <DialogTitle>
          Change Config
          <StyledSpan
            onClick={setConfigDefault}
          >
            Set Default
          </StyledSpan>
          <Version>
            [version: {version}]
          </Version>
        </DialogTitle>
        <Container>
          <LeftSide config={config} updateConfig={updateConfig} runInitialAnimation={runInitialAnimation} />
          <Divider orientation="vertical" FlexItem />
          <RightSide config={config} updateConfig={updateConfig} />
        </Container>
        <DialogActions>
          <Button sx={{ color: 'white' }} onClick={handleYes} autoFocus>
            OK
          </Button>
        </DialogActions>
      </CustomDialog>
  );
}

export default React.memo(ConfigDialog);