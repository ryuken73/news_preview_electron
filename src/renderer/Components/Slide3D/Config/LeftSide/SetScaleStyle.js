import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {scaleStyle:defaultValue} = defaultConfig;

function SetScaleStyle(props) {
  const { config, updateConfig } = props;
  const { scaleStyle } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('scaleStyle', value);
    },
    [updateConfig]
  );
  const currentVaue = scaleStyle;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'yellow' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Global ] Video Scale Style :
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={scaleStyle}
        onChange={onChange}
      >
        <FormControlLabel value="1" control={<Radio />} label="1" />
        <FormControlLabel value="2" control={<Radio />} label="2" />
        <FormControlLabel value="3" control={<Radio />} label="3" />
        <FormControlLabel value="4" control={<Radio />} label="4" />
        <FormControlLabel value="5" control={<Radio />} label="5" />
        <FormControlLabel value="6" control={<Radio />} label="6" />
        <FormControlLabel value="7" control={<Radio />} label="7" />
      </RadioGroup>
    </FormControl>
  );
}

export default React.memo(SetScaleStyle);
