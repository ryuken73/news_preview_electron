import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {titleFontSize:defaultValue} = defaultConfig;

function SetTitleFontSize(props) {
  const { config, updateConfig } = props;
  const { titleFontSize = 30 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('titleFontSize', value);
    },
    [updateConfig]
  );
  const currentVaue = titleFontSize;
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
        value={titleFontSize}
        onChange={onChange}
        min={5}
        max={40}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetTitleFontSize);