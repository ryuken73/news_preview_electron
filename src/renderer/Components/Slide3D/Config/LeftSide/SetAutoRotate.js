import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {autoRotate:autoRotateDefault} = defaultConfig;

function SetAutoRotate(props) {
  const { config, updateConfig } = props;
  const { autoRotate } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('autoRotate', value === 'yes');
      updateConfig('autoRotateInSetting', value === 'yes');
    },
    [updateConfig]
  );
  const isSame = autoRotate === autoRotateDefault;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'yellow' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Global ] Enable Auto Rotate :
        <CustomSpan isSame={isSame}>{autoRotate.toString()}</CustomSpan> ({autoRotateDefault.toString()})
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={autoRotate ? 'yes' : 'no'}
        onChange={onChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="True" />
        <FormControlLabel value="no" control={<Radio />} label="False" />
      </RadioGroup>
    </FormControl>
  );
}

export default React.memo(SetAutoRotate);
