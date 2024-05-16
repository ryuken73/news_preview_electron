import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {videoScale:defaultValue} = defaultConfig;

function SetVideoScale(props) {
  const { config, updateConfig } = props;
  const { videoScale = 2 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('videoScale', value);
    },
    [updateConfig]
  );
  const currentVaue = videoScale;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'yellow' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Global ] Video Scale : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={videoScale}
        onChange={onChange}
        step={0.1}
        min={1.5}
        max={3}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetVideoScale);