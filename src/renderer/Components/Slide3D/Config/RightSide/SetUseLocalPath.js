import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {useLocalPath:defaultValue} = defaultConfig;

function SetUseLocalPath(props) {
  const { config, updateConfig } = props;
  const { useLocalPath = false } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('useLocalPath', value === 'yes');
    },
    [updateConfig]
  );
  const currentVaue = useLocalPath;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'lightgrey' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Play From ] Video From Local Path :
        <CustomSpan isSame={isSame}>{currentVaue.toString()}</CustomSpan> ({defaultValue.toString()})
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={useLocalPath ? 'yes' : 'no'}
        onChange={onChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="True" />
        <FormControlLabel value="no" control={<Radio />} label="False" />
      </RadioGroup>
    </FormControl>
  );
}

export default React.memo(SetUseLocalPath);
