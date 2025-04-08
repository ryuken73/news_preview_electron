import * as React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import LeftSide from './LeftSide';
import version from '../../../version';

const CustomDialog = styled(Dialog)`
  z-index: 25000 !important;
  div.MuiDialog-container {
    div.MuiPaper-root {
      background: black;
      opacity: 0.8;
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
  margin-right: 10px;
  font-size: 15px;
  opacity: 0.6;
`
const StyledSelect = styled.select`
`
function ConfigDialog(props) {
  console.log(props)
  const {
    configDialogOpen,
    toggleDialogOpen ,
    config,
    setConfig,
    saveToLocalStorage,
    defaultConfig,
    updateConfig,
    runInitialAnimation,
    currentAssetId,
    newsPreviewList=[],
    setDBFromServer
  } = props;

  const handleYes = React.useCallback(() => {
    toggleDialogOpen();
  }, [toggleDialogOpen]);

  const setConfigDefault = React.useCallback(() => {
    setConfig(defaultConfig);
    saveToLocalStorage(defaultConfig);
  }, [defaultConfig, saveToLocalStorage, setConfig])

  const openDevTools = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('openDevtools');
  }, [])

  const changePreview = React.useCallback((event) => {
    const assetId = event.target.value;
    if(assetId === 'select') return;
      setDBFromServer('byAssetId', assetId);
    },
    [setDBFromServer],
  );

  const reloadPage = React.useCallback(() => {
    window.location.reload();
  }, []);

  const quitApp = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('quitApp');
  }, [])

  console.log('##', currentAssetId, typeof currentAssetId);

  return (
      <CustomDialog open={configDialogOpen} onClose={handleYes}>
        <DialogTitle>
          Change Config
          <StyledSpan
            onClick={setConfigDefault}
          >
            Set Default
          </StyledSpan>
          <StyledSpan
            onClick={openDevTools}
          >
            Open DevTools
          </StyledSpan>
          <Version>
            [version: {version}]
          </Version>
          <StyledSelect onChange={changePreview}>
            <option value="select">Select a Preview</option>
            {newsPreviewList.map(newsPreview => (
              newsPreview.assetId == currentAssetId ?(
              <option
                value={newsPreview.assetId}
                selected
              >
                {newsPreview.assetTitle}
              </option>
              ) :
              (<option
                value={newsPreview.assetId}
              >
                {newsPreview.assetTitle}
              </option>)
            ))}
          </StyledSelect>
          <StyledSpan
            onClick={reloadPage}
          >
            Reload
          </StyledSpan>
          <StyledSpan
            onClick={quitApp}
          >
            Quit
          </StyledSpan>
        </DialogTitle>
        <Container>
          <LeftSide config={config} updateConfig={updateConfig} runInitialAnimation={runInitialAnimation} />
          <Divider orientation="vertical" FlexItem />
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
