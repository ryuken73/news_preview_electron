import * as React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CustomSpan from '../CustomSpan';
import defaultConfig from '../defaultConfig';

const {mediaRoot: defaultValue} = defaultConfig;

const dialogConfig = {
  title: 'select path for local play',
  buttonLabel: '선택',
  properties: ['openDirectory']
};
const Path = styled.div`
  display: flex;
  align-items: center;
  max-width: 450px;
`
const Title = styled.div`
  font-size: 12px;
  color: yellow;
  min-width: 50px;
`
const Value = styled.div`
  font-size: 14px;
  color: cyan;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

function SetLocalMediaPath(props) {
  const { config, updateConfig } = props;
  const { mediaRoot='' } = config;

  const onClick = React.useCallback(() => {
    window.electron.ipcRenderer.once('showOpenDialog', (result) => {
      const { canceled, filePaths } = result;
      if(canceled) return;
      const [dir, ...rest] = filePaths;
      updateConfig('mediaRoot', dir);
    })
    window.electron.ipcRenderer.sendMessage('showOpenDialog', dialogConfig);
  }, [updateConfig]);

  const currentValue = mediaRoot;
  const isSame = defaultValue === currentValue;

  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'lightgrey' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Play From ] Change Local Path : 
        <CustomSpan isSame={isSame}>{isSame ? 'same' : 'diff'}</CustomSpan>
      </FormLabel>
      <Path>
        <Title>current : </Title>
        <Value>{currentValue}</Value>
      </Path>
      <Buttons>
        <Button variant="contained" onClick={onClick}>
          choose path
        </Button>
      </Buttons>
    </FormControl>
  );
}

export default React.memo(SetLocalMediaPath);
