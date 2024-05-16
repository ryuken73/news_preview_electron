import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {radius:defaultValue} = defaultConfig;

function SetItemRadius(props) {
  const { config, updateConfig, runInitialAnimation } = props;
  const { radius = 600 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('radius', value);
      runInitialAnimation()
    },
    [runInitialAnimation, updateConfig]
  );
  const currentVaue = radius;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'yellow' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Global ] Rotate Radius : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={radius}
        onChange={onChange}
        min={400}
        max={1000}
        step={20}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetItemRadius);