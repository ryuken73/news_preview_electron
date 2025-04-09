import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {videoFilterValueGrid:defaultValue} = defaultConfig;

function SetVideoFilterValue(props) {
  const { config, updateConfig } = props;
  const { videoFilterValueGrid = defaultValue } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('videoFilterValueGrid', value);
    },
    [updateConfig]
  );
  const currentVaue = videoFilterValueGrid;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'white' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Video ]  Video Filter Value : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={videoFilterValueGrid}
        onChange={onChange}
        min={0}
        max={100}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetVideoFilterValue);