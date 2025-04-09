/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import backImage from '../../assets/images/background.jpg';
import ConfigDialog from './Config/ConfigDialog';
import useLocalStorage from '../../hooks/useLocalStorage';
import defaultConfig from './Config/defaultConfig';

const Container = styled.div`
  font-family: ${props => props.fontFamily};
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 49%);
  grid-template-rows: repeat(2, 48%);
  justify-content: space-evenly;
  align-content: space-evenly;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background-size: cover;
`;
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  /* transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s; */
  transition: ${props => `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${props.transitionDelay}s`};
  z-index: ${props => props.zIndex};
  filter: ${props => !props.isActive && `${props.videoFilter.type}(${props.videoFilter.value}%)`};
  /* filter: ${props => !props.isActive && 'grayscale()'}; */
  /* filter: ${props => !props.isActive && 'sepia(60%)'}; */
  /* filter: ${props => !props.isActive && 'saturate(20%)'}; */
  /* filter: ${props => !props.isActive && 'brightness(50%)'}; */
  /* filter: ${props => !props.isActive && 'invert(30%)'}; */
  /* filter: ${props => !props.isActive && 'hue-rotate(120deg)'}; */
  /* filter: ${props => !props.isActive && 'contrast(60%)'}; */
  transform: ${(props) =>
    props.isActive &&
    `translate(${props.translateFactor[0] * 50.6}%, ${props.translateFactor[1] * 51.4}%) scale(2.15)`};
`;
const CustomButton = styled.div`
  position: absolute;
  bottom: 35px;
  right: 40px;
  font-size: 20px;
  background: black;
  border-radius: 5px;
  backdrop-filter: blur(1px);
  padding: 5px;
  z-index: 100;
  opacity: 0.5;
  width: 30px;
`
const TitleContainer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
`
const Title = styled.div`
  width: 100%;
  /* background-color: rgba(0, 0, 0, 0.4); */
  background-color: ${props => props.bgColor || 'rgba(0, 0, 0, 0.4)'};
  padding: 10px;
  box-sizing: border-box;
  /* font-size: 50px; */
  font-size: ${props => `${props.fontSize}px`||'50px'};
  padding-top: 20px;
  padding-bottom: 20px;
`
const OpenDevTool = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`
const Item = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-radius: 30px;
  line-height: 200px;
  font-size: 50px;
  text-align: center;
`;
const ConfigButton = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  min-height: 20px;
  min-width: 20px;
  background-color: transparent;
`
const INITIAL_CONFIG = defaultConfig;

const TRNSLATE_FACTOR = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

function GridCards(props) {
  const { db, setDBFromServer, newsPreviewList, currentAssetId } = props;
  const [storedValue, saveToLocalStorage] = useLocalStorage('slide3D', INITIAL_CONFIG);
  const [zIndexes, setZindexes] = React.useState(new Array(db.length || 4));
  const [activeIdState, setActiveIdState] = React.useState(null);
  const [inTransition, setInTransition] = React.useState(false);
  const [config, setConfig] = React.useState(INITIAL_CONFIG);
  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);

  const videoContaiersRef = React.useRef([]);
  const itemsRef = React.useRef([]);
  const lastZindex = React.useRef(1);

  console.log('activeIDState', activeIdState)
  const LOCAL_MEDIA_PATH = config.mediaRootGrid;
  const USE_LOCAL_PATH = config.useLocalPathGrid || false;
  const TITLE_FONT_SIZE = config.titleFontSizeGrid || 50;
  const TITLE_FONT_FAMILY = config.titleFontFamilyGrid || 'SUITE';
  const TITLE_BAR_COLOR = config.titleBarColorGrid || 'rgba(0, 0, 0, 0.4)';
  const VIDEO_FILTER_TYPE = config.videoFilterTypeGrid || 'saturate';
  const VIDEO_FILTER_VALUE = config.videoFilterValueGrid == undefined ? 20 : config.videoFilterValueGrid;
  const VIDEO_TRANSITION_DELAY = config.videoTransitionDelayGrid === undefined ? 0.2 : config.videoTransitionDelayGrid;
  const REG_PATTERN = /http:\/\/.*\/(\d{8}\/.*\.mp4)/;
  const toLocalPath = React.useCallback(
    (remoteSrc) => {
      const match = remoteSrc.match(REG_PATTERN);
      if (match === null) {
        return remoteSrc;
      }
      const group = match[1];
      const localSrc = `${LOCAL_MEDIA_PATH}/${group}`;
      console.log(localSrc);
      return localSrc;
    },
    [LOCAL_MEDIA_PATH, REG_PATTERN],
  );

  // initialize config from localStorage
  React.useEffect(() => {
    console.log('load from localStorage to config:', storedValue)
    setConfig(storedValue)
  }, [storedValue])

  const toggleDialogOpen = React.useCallback(() => {
    setConfigDialogOpen(configDialogOpen => !configDialogOpen);
  }, [])

  const updateConfig = React.useCallback((key, value, saveLocal=true) => {
    setConfig(config => {
      const newConfig = {
        ...config,
        [key]: value
      }
      if(saveLocal){
        saveToLocalStorage(newConfig);
      }
      return newConfig;
    })
  }, [saveToLocalStorage])

  const onClickItem = React.useCallback((e) => {
    console.log('onClickItem', e.target.id, e.target.style);
    const {id} = e.target;
    if(id === ''){
      return;
    }
    const currentPlayer = itemsRef.current[id];
    if (id === activeIdState) {
      if(currentPlayer.paused){
        currentPlayer.play();
      } else {
        currentPlayer.pause();
      }
      return;
    }
    setInTransition(true);
    setZindexes((zIndexes) => {
      const newArray = [...zIndexes];
      const nextZindex = lastZindex.current + 1
      newArray[e.target.id] = nextZindex;
      lastZindex.current = nextZindex;
      return newArray;
    })
    setActiveIdState(e.target.id);
    },
    [activeIdState],
  );

  const onTransitionEnd = React.useCallback((e) => {
    const {id} = e.target;
    if (e.propertyName === 'transform') {
      setInTransition(false);
    }
    console.log('Transition end', id, e.propertyName, e);
  }, []);

  const resetActiveId = React.useCallback((e) => {
    setInTransition(true)
    e.stopPropagation();
    const {id} = e.target;
    console.log('button clicked', e.target)
    const currentPlayer = itemsRef.current[id];
    currentPlayer.pause();
    const resetZindexes = (event) => {
      console.log('reset zindex event:', event);
      if (event.propertyName === 'transform') {
        // setZindexes(new Array(db.length || 4));
        setInTransition(false)
      }
    }
    e.target.parentElement.addEventListener('transitionend', resetZindexes, {
      once: true,
    });
    setActiveIdState(null);
  }, []);


  // const openDevTools = React.useCallback(() => {
  //   window.electron.ipcRenderer.sendMessage('openDevtools');
  // }, [])

  return (
    <div>
      <Container fontFamily={TITLE_FONT_FAMILY}>
        {db.map((item, i) => (
          <VideoContainer
            key={item.id}
            id={i}
            ref={(el) => (videoContaiersRef.current[i] = el)}
            isActive={i === parseInt(activeIdState)}
            translateFactor={TRNSLATE_FACTOR[i]}
            onTransitionEnd={onTransitionEnd}
            onClick={onClickItem}
            zIndex={zIndexes[i]}
            videoFilter={{ type: VIDEO_FILTER_TYPE, value: VIDEO_FILTER_VALUE }}
            transitionDelay={VIDEO_TRANSITION_DELAY}
          >
            <Item
              crossOrigin="anonymous"
              id={i}
              src={USE_LOCAL_PATH ? toLocalPath(item.src) : item.src}
              ref={(el) => (itemsRef.current[i] = el)}
              itemIndex={i}
              itemLength={db.length}
              radius={config.radius}
              isActive={i === parseInt(activeIdState)}
              muted
            />
            {i === parseInt(activeIdState) && !inTransition && (
              <CustomButton
                id={i}
                onClick={resetActiveId}
              >
                R
              </CustomButton>
            )}
            {/* <OpenDevTool onClick={openDevTools}>open</OpenDevTool> */}
            {item.title !== undefined && item.title.length !== 0 && (
              <TitleContainer>
                <Title
                  fontSize={TITLE_FONT_SIZE}
                  bgColor={TITLE_BAR_COLOR}
                >{item.title}</Title>
              </TitleContainer>
            )}
          </VideoContainer>
        ))}
        {/* <QuitButton onClick={quitApp} /> */}
        <ConfigButton onClick={toggleDialogOpen} />
        <ConfigDialog
          configDialogOpen={configDialogOpen}
          toggleDialogOpen={toggleDialogOpen}
          config={config}
          setConfig={setConfig}
          updateConfig={updateConfig}
          saveToLocalStorage={saveToLocalStorage}
          defaultConfig={INITIAL_CONFIG}
          currentAssetId={currentAssetId}
          newsPreviewList={newsPreviewList}
          setDBFromServer={setDBFromServer}
        ></ConfigDialog>
      </Container>
    </div>
  );
}

export default React.memo(GridCards);
