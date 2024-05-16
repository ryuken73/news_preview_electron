import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {idleVideoWidth:defaultValue} = defaultConfig;

function SetIdleVideoWidth(props) {
  const { config, updateConfig } = props;
  const { idleVideoWidth = 600 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('idleVideoWidth', value);
    },
    [updateConfig]
  );
  const currentVaue = idleVideoWidth;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'lightblue' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Video ] Idle Video Width : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={idleVideoWidth}
        onChange={onChange}
        min={500}
        max={2000}
        step={50}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetIdleVideoWidth);