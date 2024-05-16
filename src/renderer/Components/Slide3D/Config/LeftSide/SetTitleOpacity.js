import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {titleOpacity:defaultValue} = defaultConfig;

function SetTitleOpacity(props) {
  const { config, updateConfig } = props;
  const { titleOpacity = 0.7 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('titleOpacity', value);
    },
    [updateConfig]
  );
  const currentVaue = titleOpacity;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'white' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Title Header ] Opacity : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={titleOpacity}
        onChange={onChange}
        min={0}
        max={1}
        step={0.1}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetTitleOpacity);