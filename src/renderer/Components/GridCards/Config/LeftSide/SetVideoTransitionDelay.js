import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {videoTransitionDelayGrid:defaultValue} = defaultConfig;

function SetVideoTransitionDelay(props) {
  const { config, updateConfig } = props;
  const { videoTransitionDelayGrid = defaultValue } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('videoTransitionDelayGrid', value);
    },
    [updateConfig]
  );
  const currentVaue = videoTransitionDelayGrid;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'white' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Video ]  Video Transition Delay(seconds) : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={videoTransitionDelayGrid}
        onChange={onChange}
        min={0}
        step={0.1}
        max={0.5}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetVideoTransitionDelay);