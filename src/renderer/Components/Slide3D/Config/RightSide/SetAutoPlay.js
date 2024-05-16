import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {autoPlay:defaultValue} = defaultConfig;

function SetAutoPlay(props) {
  const { config, updateConfig } = props;
  const { autoPlay } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('autoPlay', value === 'yes');
    },
    [updateConfig]
  );
  const currentVaue = autoPlay;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'lightblue' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Video ] Enable Auto Next :
        <CustomSpan isSame={isSame}>{currentVaue.toString()}</CustomSpan> ({defaultValue.toString()})
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={autoPlay ? 'yes' : 'no'}
        onChange={onChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="True" />
        <FormControlLabel value="no" control={<Radio />} label="False" />
      </RadioGroup>
    </FormControl>
  );
}

export default React.memo(SetAutoPlay);
