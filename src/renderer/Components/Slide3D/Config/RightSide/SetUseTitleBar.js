import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {useTitleBar:defaultValue} = defaultConfig;

function SetUseTitleBar(props) {
  const { config, updateConfig } = props;
  const { useTitleBar } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('useTitleBar', value === 'yes');
    },
    [updateConfig]
  );
  const currentVaue = useTitleBar;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'lightgoldenrodyellow' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Title List ] Show (on the Right Side) :
        <CustomSpan isSame={isSame}>{currentVaue.toString()}</CustomSpan> ({defaultValue.toString()})
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={useTitleBar ? 'yes' : 'no'}
        onChange={onChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="True" />
        <FormControlLabel value="no" control={<Radio />} label="False" />
      </RadioGroup>
    </FormControl>
  );
}

export default React.memo(SetUseTitleBar);
