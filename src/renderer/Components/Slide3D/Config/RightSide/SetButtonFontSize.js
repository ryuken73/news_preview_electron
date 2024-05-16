import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {buttonFontSize:defaultValue} = defaultConfig;

function SetButtonFontSize(props) {
  const { config, updateConfig } = props;
  const { buttonFontSize = 30 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('buttonFontSize', value);
    },
    [updateConfig]
  );
  const currentVaue = buttonFontSize;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'lightgoldenrodyellow' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Title List ] Font Size : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={buttonFontSize}
        onChange={onChange}
        min={5}
        max={40}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetButtonFontSize);