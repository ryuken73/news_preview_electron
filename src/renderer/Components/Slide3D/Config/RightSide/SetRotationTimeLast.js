import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {rotationTimeLast:defaultValue} = defaultConfig;

function SetLotationTimeLast(props) {
  const { config, updateConfig } = props;
  const { rotationTimeLast = 15 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('rotationTimeLast', value);
    },
    [updateConfig]
  );
  const currentVaue = rotationTimeLast;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'lightblue' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Video ] Rotation Time Last : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={rotationTimeLast}
        onChange={onChange}
        min={2}
        max={60}
        step={1}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetLotationTimeLast);