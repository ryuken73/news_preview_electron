import React from 'react';
import styled, {css} from 'styled-components';
import { keyframes } from '@emotion/react'
import Zoom from '@mui/material/Zoom';
import Draggable from 'react-draggable';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import MovingIcon from '@mui/icons-material/Moving';
import GestureIcon from '@mui/icons-material/Gesture';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
import SignalWifi2BarIcon from '@mui/icons-material/SignalWifi2Bar';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import DragHandle from 'renderer/Components/Draw/DragHandle';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useDrawState from 'renderer/hooks/useDrawState';
import usePrevious from 'renderer/hooks/usePrevious';
import CONSTANTS from 'renderer/config/constants';
import { red } from '@mui/material/colors';

const { POSITION } = CONSTANTS;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* min-width: 130px; */
`

const ToolDivWithPosition = styled.div`
  position: absolute;
  top: ${POSITION.toolContainer.top};
  right: ${POSITION.toolContainer.right};
  z-index: 9999;
  margin: 3px;
  padding: 5px;
  border-radius: 5px;
  border: ${props => props.isDragging && "2px dashed"};
  opacity: ${props => props.isDragging && "0.5"};
`;

const simple = `
      ".       pen     dragger"
      "color1  color2  arrow"
      "color3  color4  stroke"
      "undo    remove  size";`

const twoColumn = `
      "pen     dragger"
      "color1  color2"
      "color3  color4"
      "arrow   stroke"
      "undo    remove"
      ".       size";
`;
const oneColumn = `
      "dragger"
      "pen"
      "color1"
      "color2"
      "color3"
      "color4"
      "arrow"
      "stroke"
      "undo"
      "remove"
      "size";
`;
const gridType = {
  simple,
  twoColumn,
  oneColumn
};
const columnNum = {
  simple: 3,
  twoColumn: 2,
  oneColumn: 1
}
const closedGrid = {
  simple: `".    pen dragger";`,
  twoColumn: `"pen dragger";`,
  oneColumn: `
    "dragger"
    "pen"
  `,
}


const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${columnNum[props.toolContainerType]}, minmax(44px, 1fr))`};
  grid-template-areas: ${(props) =>
    props.drawShow
      ? gridType[props.toolContainerType]
      : closedGrid[props.toolContainerType]};
  gap: 0px 0px;
  background: rgb(0, 0, 0, 0.3);
  padding: 5px;
  border-radius: 10px;
  div {
    &:nth-child(1) { grid-area: pen; }
    &:nth-child(2) { grid-area: dragger; margin-top: 4px; }
    &:nth-child(3) { grid-area: color1; }
    &:nth-child(4) { grid-area: color2; }
    &:nth-child(5) { grid-area: arrow; }
    &:nth-child(6) { grid-area: color3; }
    &:nth-child(7) { grid-area: color4; }
    &:nth-child(8) { grid-area: stroke; }
    &:nth-child(9) { grid-area: undo; }
    &:nth-child(10) { grid-area: remove; }
    &:nth-child(11) { grid-area: size; }
  }
`;
const PalleteContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  // background: #140e30;
  opacity: 0.8 !important;
  // color: white;
  // border-radius: 10px;
  margin-top: 0px;
  padding: 2px;
  flex-wrap: wrap;
  width: 80px;
  // border: 2px solid white;
  /* width: 100px; */
`;
const RowFlexBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const ColorBox = styled.div`
  width: 38px;
  height: 38px;
  background: ${(props) => props.color};
  border-radius: 7px;
  cursor: pointer;
  font-size: 20px;
`;
const IconContainer = styled(PalleteContainer)`
  // background: grey;
  opacity: 0.8 !important;
`;
const IconContainerOne = styled(IconContainer)`
  width: 40px;
`;
const IconContainerVertical = styled(IconContainerOne)`
  width: 34px;
  margin-left: 5px;
`;
const iconStyle = {
  background: '#140e30',
  color: 'white',
  borderRadius: '20%',
  fontSize: '34px',
  padding: '3px !important',
};
const blink = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
    color: grey;
  }
  100% {
    opacity: 1;
  }
`;
const iconStyleBlink = {
  ...iconStyle,
  animation: `${blink} 2s infinite`,
};
const iconStyleRed = {
  ...iconStyle,
  background: 'maroon'
}

const CheckSvg = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 20"
      fill={props.color}
    >
      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
    </svg>
  );
};

const COLORS = ['red', 'darkblue', 'black', 'yellow'];
const CHECK_COLORS = ['black', 'white', 'white', 'black'];
const COLORS_3 = ['darkblue', 'black', 'yellow'];
const CHECK_COLORS_3 = ['white', 'white', 'black'];
const getNextColor = (color) => {
  const nextIndex = COLORS.indexOf(color) + 1;
  const safeNextIndex = nextIndex === COLORS.length ? 0 : nextIndex;
  return COLORS[safeNextIndex];
};

const SIZE_OFFSETS = [0, 6, 12, 24];
const ToolContainer = (props) => {
  // eslint-disable-next-line react/prop-types
  const { drawShow, toggleDraw } = props;
  const [currentColor, setCurrentColor] = React.useState('red');
  const [isDragging, setIsDragging] = React.useState(false);
  const {
    currentOptions,
    strokeWidthFromConfig,
    changePathOptionState,
    clearPathDatumState,
    undoPathDatumState,
  } = useDrawState();
  const baseLineSize = 6;
  const toolContainerType = 'twoColumn' ;
  const {
    size,
    strokeWidth,
    thinning,
    streamline,
    smoothing,
    isFilled,
    stroke,
    fill,
    withArrow
  } = currentOptions;

  const prevStrokeWidth = usePrevious(strokeWidth);

  const getNextSizeByOffset = React.useCallback((currentSize) => {
    const offset = currentSize - baseLineSize;
    const nextIndex = SIZE_OFFSETS.indexOf(offset) + 1;
    const safeNextIndex = nextIndex === SIZE_OFFSETS.length ? 0 : nextIndex;
    return SIZE_OFFSETS[safeNextIndex] + baseLineSize;
    },
    [baseLineSize]
  );

  const showStokeIconGrey = !drawShow || strokeWidth === 0;

  const withOutline = {
    ...iconStyle,
    background: `${showStokeIconGrey ? 'darkgrey' : '#140e30'}`,
  };
  const noOutline = {
    ...iconStyle,
    background: `${showStokeIconGrey ? '#140e30' : 'darkgrey'}`,
  };

  const PencilIcon = strokeWidth === 0 ? CircleIcon : PanoramaFishEyeIcon;
  const pencilStyle = strokeWidth === 0 ? noOutline : withOutline;
  const ArrowIcon = withArrow ? MovingIcon : GestureIcon;

  // eslint-disable-next-line no-nested-ternary
  const SizeIcon =
    // eslint-disable-next-line no-nested-ternary
    size === baseLineSize + SIZE_OFFSETS[0]
      ? SignalWifi1BarIcon
      : size === baseLineSize + SIZE_OFFSETS[1]
      ? SignalWifi2BarIcon
      : size === baseLineSize + SIZE_OFFSETS[2]
      ? SignalWifi3BarIcon
      : SignalWifi4BarIcon;

  const onClickColor = React.useCallback((event) => {
      const targetFill = event.currentTarget.getAttribute('color');
      changePathOptionState('fill', targetFill);
      changePathOptionState('stroke', CHECK_COLORS[COLORS.indexOf(targetFill)]);
    },
    [changePathOptionState]
  );

  // const toggleColor = React.useCallback(() => {
  //   const nextColor = getNextColor(currentColor);
  //   changePathOptionState('fill', nextColor);
  //   changePathOptionState('stroke', CHECK_COLORS[COLORS.indexOf(nextColor)]);
  //   setCurrentColor(nextColor);
  // }, [changePathOptionState, currentColor]);

  const toggleStroke = React.useCallback(() => {
    const nextValue = strokeWidth === 0 ? strokeWidthFromConfig : 0;
    console.log('stroke:', nextValue, strokeWidth, strokeWidthFromConfig)
    changePathOptionState('strokeWidth', nextValue);
  }, [changePathOptionState, strokeWidth, strokeWidthFromConfig]);

  const toggleWithArrow = React.useCallback(() => {
    const nextValue = !withArrow;
    changePathOptionState('withArrow', nextValue);
    /* if (nextValue === true) {
      changePathOptionState('strokeWidth', 0);
    } else {
      changePathOptionState('strokeWidth', strokeWidthFromConfig);
    } */
  }, [changePathOptionState, strokeWidthFromConfig, withArrow]);

  const toggleSize = React.useCallback(() => {
    const nextValue = getNextSizeByOffset(size);
    changePathOptionState('size', nextValue);
  }, [changePathOptionState, getNextSizeByOffset, size]);

  const onStartDrag = React.useCallback((event) => {
    setIsDragging(true);
  }, [setIsDragging])

  const onStopDrag = React.useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging])

  const timeout = 200;

  return (
    <Draggable bounds="#root" handle="#dragger" onStart={onStartDrag} onStop={onStopDrag}>
    <ToolDivWithPosition isDragging={isDragging}>
    <Container>
          <GridContainer
            drawShow={drawShow}
            toolContainerType={toolContainerType}
          >
      {/* <FlexContainer> */}
      <IconContainerOne className="item">
        <IconButton
          sx={{ padding: '0px' }}
          onClick={toggleDraw}
        >
          <ModeEditIcon sx={drawShow ? iconStyleRed : iconStyle} />
        </IconButton>
      </IconContainerOne>
      <IconContainerOne id="dragger">
        <DragHandle className="dragHandler" size="small" />
      </IconContainerOne>
      {/* </FlexContainer> */}
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: 'right 50%',
            transitionDelay: 0,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <ColorBox
              // onTouchStart={onClickColor}
              onClick={onClickColor}
              color="red"
            >
              {fill === 'red' && <CheckSvg color="black" />}
            </ColorBox>
          </IconContainerOne>
        </Zoom>
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: 'right 50%',
            transitionDelay: 0,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <ColorBox
              // onTouchStart={onClickColor}
              onClick={onClickColor}
              color="yellow"
            >
              {fill === 'yellow' && <CheckSvg color="black" />}
            </ColorBox>
          </IconContainerOne>
        </Zoom>
        {/* arrow enable/disable */}
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: 'right 0%',
            transitionDelay: 100,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <IconButton
              sx={{ padding: '0px' }}
              size="medium"
              // onTouchStart={toggleWithArrow}
              onClick={toggleWithArrow}
              // onTouchTap={toggleWithArrow}
            >
              <ArrowIcon sx={iconStyle} />
            </IconButton>
          </IconContainerOne>
        </Zoom>
        {/* color changer */}
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: 'right 50%',
            transitionDelay: 0,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <ColorBox
              // onTouchStart={onClickColor}
              onClick={onClickColor}
              color="darkblue"
            >
              {fill === 'darkblue' && <CheckSvg color="white" />}
            </ColorBox>
          </IconContainerOne>
        </Zoom>
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: 'right 50%',
            transitionDelay: 0,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <ColorBox
              // onTouchStart={onClickColor}
              onClick={onClickColor}
              color="black"
            >
              {fill === 'black' && <CheckSvg color="white" />}
            </ColorBox>
          </IconContainerOne>
        </Zoom>
        {/* toggleStrokie */}
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: 'right 0%',
            transitionDelay: 100,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <IconButton
              sx={{ padding: '0px' }}
              size="medium"
              // onTouchStart={toggleStroke}
              onClick={toggleStroke}
              // onTouchTap={toggleStroke}
            >
              <PencilIcon sx={pencilStyle} />
            </IconButton>
          </IconContainerOne>
        </Zoom>
        {/* minus paths */}
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: '50% top',
            transitionDelay: 200,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <IconButton
              sx={{ padding: '0px' }}
              size="medium"
              // onTouchStart={undoPathDatumState}
              onClick={undoPathDatumState}
            >
              <IndeterminateCheckBoxIcon sx={iconStyle} />
            </IconButton>
          </IconContainerOne>
        </Zoom>
        {/* clear button */}
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: 'left 0%',
            transitionDelay: 300,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <IconButton
              sx={{ padding: '0px' }}
              size="medium"
              // onTouchStart={clearPathDatumState}
              onClick={clearPathDatumState}
            >
              <DeleteForeverIcon sx={iconStyle} />
            </IconButton>
          </IconContainerOne>
        </Zoom>
        {/* toggle size of pen */}
        <Zoom
          in={drawShow}
          timeout={timeout}
          style={{
            transformOrigin: 'left 50%',
            transitionDelay: 300,
            display: drawShow ? 'flex' : 'none',
          }}
          className="item"
        >
          <IconContainerOne>
            <IconButton
              sx={{ padding: '0px' }}
              size="medium"
              // onTouchStart={toggleSize}
              onClick={toggleSize}
              // onTouchTap={toggleSize}
            >
              <SizeIcon sx={iconStyle} />
            </IconButton>
          </IconContainerOne>
        </Zoom>
        {/* <Zoom in={drawShow} timeout={500} style={{ transformOrigin: '0 0 0' }}>
          <div>
            <RowFlexBox>
            <PalleteContainer>
              {COLORS.map((color, index) => (
                  <ColorBox
                    key={color}
                    onTouchStart={onClickColor}
                    onClick={onClickColor}
                    color={color}
                  >
                    {fill === color && <CheckSvg color={CHECK_COLORS[index]} />}
                  </ColorBox>
                ))}
            </PalleteContainer>
            </RowFlexBox>
            <IconContainer>
              <IconButton
                sx={{ padding: '0px' }}
                size="medium"
                onTouchStart={toggleStroke}
                onClick={toggleStroke}
              >
                <CircleIcon sx={noOutline} />
              </IconButton>
              <IconButton
                sx={{ padding: '0px' }}
                size="medium"
                onTouchStart={toggleStroke}
                onClick={toggleStroke}
              >
                <PanoramaFishEyeIcon sx={withOutline} />
              </IconButton>
            </IconContainer>
            <IconContainer>
              <IconButton
                sx={{ padding: '0px' }}
                size="medium"
                onTouchStart={undoPathDatumState}
                onClick={undoPathDatumState}
              >
                <IndeterminateCheckBoxIcon sx={iconStyle} />
              </IconButton>
              <IconButton
                sx={{ padding: '0px' }}
                size="medium"
                onTouchStart={clearPathDatumState}
                onClick={clearPathDatumState}
              >
                <DeleteForeverIcon sx={iconStyle} />
              </IconButton>
            </IconContainer>
          </div>
        </Zoom> */}
      </GridContainer>
    </Container>
    </ToolDivWithPosition>
    </Draggable>
  );
};

export default React.memo(ToolContainer);
