import React from 'react'
import styled from 'styled-components'
const Span = styled.span`
  background: ${props => !props.isSame && 'yellow'};
  color: ${props => !props.isSame && 'black'};
  font-weight: ${props => !props.isSame && 600};
  font-size: ${props => !props.isSame && '18px'};
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 5px;
`

export default React.memo(Span);