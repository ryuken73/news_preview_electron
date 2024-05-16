import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {titleFontWeight:defaultValue} = defaultConfig;

function SetTitleFontWeight(props) {
  const { config, updateConfig } = props;
  const { titleFontWeight = 500 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('titleFontWeight', value);
    },
    [updateConfig]
  );
  const currentVaue = titleFontWeight;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'white' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Title Header ] Font Weight : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <Slider
        aria-label="swipeThreshold"
        value={titleFontWeight}
        onChange={onChange}
        min={100}
        max={900}
        step={100}
        valueLabelDisplay="auto"
      />
    </FormControl>
  );
}

export default React.memo(SetTitleFontWeight);