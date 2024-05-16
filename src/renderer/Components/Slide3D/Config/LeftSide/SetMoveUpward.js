import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {moveUpward:defaultValue} = defaultConfig;

function SetMoveUpward(props) {
  const { config, updateConfig } = props;
  const { moveUpward = 0 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('moveUpward', value);
    },
    [updateConfig]
  );
  const currentVaue = moveUpward;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'yellow' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Global ] Move Upward (px) : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={moveUpward}
        onChange={onChange}
        min={0}
        max={600}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetMoveUpward);