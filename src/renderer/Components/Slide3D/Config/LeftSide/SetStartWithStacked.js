import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {startWithStacked:defaultStartWithStacked} = defaultConfig;
const {stackOpacity:defaultStackOpacity} = defaultConfig;

function SetAutoRotate(props) {
  const { config, updateConfig } = props;
  const { startWithStacked = false, stackOpacity = 1 } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('startWithStacked', value === 'yes');
    },
    [updateConfig]
  );
  const onChangeStackOpacity = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('stackOpacity', value);
    },
    [updateConfig]
  );
  const currentStartWithStacked = startWithStacked;
  const currentStackOpacity = stackOpacity;
  const isSameStacked = defaultStartWithStacked === startWithStacked;
  const isSameOpacity = defaultStackOpacity === stackOpacity;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'yellow' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Global ] Start With Video Stacked :
        <CustomSpan isSame={isSameStacked}>{currentStartWithStacked.toString()}</CustomSpan> ({defaultStartWithStacked.toString()})
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={startWithStacked ? 'yes' : 'no'}
        onChange={onChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="True" />
        <FormControlLabel value="no" control={<Radio />} label="False" />
      </RadioGroup>
      {startWithStacked && (
        <FormControl>
          <FormLabel
            sx={{ color: 'yellow' }}
            id="demo-row-radio-buttons-group-label"
          >
            [ ----- ] Initial Opacity  : 
            <CustomSpan isSame={isSameOpacity}>{currentStackOpacity}</CustomSpan> ({defaultStackOpacity})
          </FormLabel>
          <Slider
            aria-label="swipeThreshold"
            value={stackOpacity}
            onChange={onChangeStackOpacity}
            min={0}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
          />
    </FormControl>

      )}
    </FormControl>
  );
}

export default React.memo(SetAutoRotate);
