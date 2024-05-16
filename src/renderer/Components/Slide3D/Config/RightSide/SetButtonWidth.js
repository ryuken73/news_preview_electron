import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {buttonWidth:defaultValue} = defaultConfig;

function SetButtonWidth(props) {
  const { config, updateConfig } = props;
  const { buttonWidth = 200 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('buttonWidth', value);
    },
    [updateConfig]
  );
  const currentVaue = buttonWidth;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'lightgoldenrodyellow' }}
        id="demo-row-ru-buttons-group-label"
      >
        [ Title List ] Width : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={buttonWidth}
        onChange={onChange}
        min={150}
        max={400}
        step={10}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetButtonWidth);