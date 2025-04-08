import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {titleFontSizeGrid:defaultValue} = defaultConfig;

function SetTitleFontSize(props) {
  const { config, updateConfig } = props;
  const { titleFontSizeGrid = defaultValue } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('titleFontSizeGrid', value);
    },
    [updateConfig]
  );
  const currentVaue = titleFontSizeGrid;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'white' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Title Header ] Font Size : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={titleFontSizeGrid}
        onChange={onChange}
        min={30}
        max={70}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetTitleFontSize);