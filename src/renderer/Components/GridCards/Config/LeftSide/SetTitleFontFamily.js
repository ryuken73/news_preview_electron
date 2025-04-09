/* eslint-disable react/prop-types */
import * as React from 'react';
import styled from 'styled-components';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import defaultConfig from '../defaultConfig';
import CustomSpan from '../CustomSpan';

const {titleFontFamilyGrid: defaultValue} = defaultConfig;

const StyledSelect = styled.select`
  margin-top: 10px;
  margin-bottom: 10px;
`
const FONT_LIST = [
  'SBAggroB',
  'SUITE',
  'RIX',
  'Cafe24Ohsquare',
  'GongGothicMedium',
  'Pretendard-Regular',
  'SangSangRock',
  'Dokrip',
  'GowunDodum-Regular',
  'RIDIBatang'
]

function SetTitleFontSize(props) {
  const { config, updateConfig } = props;
  const { titleFontFamilyGrid = defaultValue } = config;
  const onChange = React.useCallback((event) => {
      const { value } = event.target;
      updateConfig('titleFontFamilyGrid', value);
    },
    [updateConfig]
  );
  const currentVaue = titleFontFamilyGrid;
  const isSame = defaultValue === currentVaue;
  return (
    <FormControl>
      <FormLabel
        sx={{ color: 'white' }}
        id="demo-row-radio-buttons-group-label"
      >
        [ Title Header ] Font Family : 
        <CustomSpan isSame={isSame}>{currentVaue}</CustomSpan> ({defaultValue})
      </FormLabel>
      <StyledSelect onChange={onChange}>
        <option value="select">Select a Font</option>
        {FONT_LIST.map(font => (
          (<option
            value={font}
          >
            {font}
          </option>)
        ))}
      </StyledSelect>
    </FormControl>
  );
}

export default React.memo(SetTitleFontSize);