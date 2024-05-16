import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';

function SetRotationSpeed(props) {
  const { updateConfig, config } = props;
  const { rotationTime } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('rotationTime', value);
    },
    [updateConfig]
  );
  const currentVaue = rotationTime;
  return (
    <FormControl sx={{
      width: '60%', 
      opacity: 0.2, 
      marginBottom:"30px"
    }}>
      <Slider
        aria-label="swipeThreshold"
        value={currentVaue}
        onChange={onChange}
        step={1}
        min={1}
        max={100}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetRotationSpeed);