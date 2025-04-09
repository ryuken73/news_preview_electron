import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import { SketchPicker } from 'react-color';
import CustomSpan from '../CustomSpan';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`

const {titleBarColorGrid:defaultValue} = defaultConfig;

function SetTitleBarColor(props) {
  const { config, updateConfig } = props;
  const { titleBarColorGrid = defaultValue } = config;
  const onChange = React.useCallback((color) => {
      // const { value } = event.target;
      const {rgb} = color;
      const {r, g, b, a} = rgb
      const rgbaString = `rgba(${r}, ${g}, ${b}, ${a})`
      console.log(rgbaString);
      updateConfig('titleBarColorGrid', rgbaString);
    },
    [updateConfig]
  );
  const currentVaue = titleBarColorGrid;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'white' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Title Header ] Color : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Container>
        <SketchPicker
          color={titleBarColorGrid}
          onChange={onChange}
        ></SketchPicker>
      </Container>
    </FormControl>
  );
}

export default React.memo(SetTitleBarColor);