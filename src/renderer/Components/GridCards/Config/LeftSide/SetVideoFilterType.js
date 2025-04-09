/* eslint-disable react/prop-types */
import * as React from 'react';
import styled from 'styled-components';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {videoFilterTypeGrid: defaultValue} = defaultConfig;

const StyledSelect = styled.select`
  margin-top: 10px;
  margin-bottom: 10px;
`
const FILTER_LIST = [
  'saturate',
  'sepia',
  'brightness',
  'grayscale'
]

function SetVideoFilterType(props) {
  const { config, updateConfig } = props;
  const { videoFilterTypeGrid = defaultValue } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('videoFilterTypeGrid', value);
    },
    [updateConfig]
  );
  const currentVaue = videoFilterTypeGrid;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'white' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Video ] Video Filter Type : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <StyledSelect onChange={onChange}>
        <option value="select">Select a Filter</option>
        {FILTER_LIST.map(filter => (
          (<option
            value={filter}
          >
            {filter}
          </option>)
        ))}
      </StyledSelect>
    </FormControl>
  );
}

export default React.memo(SetVideoFilterType);