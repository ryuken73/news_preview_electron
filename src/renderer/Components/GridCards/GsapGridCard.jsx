import React from 'react'
import styled from 'styled-components';
import audioScaleUp from '../../assets/audio/scaleUp.mp3';
import audioScaleDown from '../../assets/audio/scaleDown.mp3';
import ConfigDialog from './Config/ConfigDialog';
import useLocalStorage from '../../hooks/useLocalStorage';
import defaultConfig from './Config/defaultConfig';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(Flip)

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: stretch;
  justify-content: center;
  background: black;
  /* row-gap: 1rem; */
  /* padding-top: 1rem; */
  /* padding-bottom: 1rem; */
  overflow: hidden;
`
const VideoContainer = styled.div`
  background: maroon;
  cursor: pointer;
  color: white;
  width: calc(50% - 2rem);
  order: ${props => props.itemId};
  padding: 10px;
`
const Item = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-radius: 20px;
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
  opacity: ${props => props.show ? 1:0};

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
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`
const OpenDevTool = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`
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

const TRANSLATE_FACTOR = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

const MOVE_OUT_FACTOR = {
  up: [0, -1],
  down: [0, 1],
  rightScale: [1, 0],
  leftScale: [-1, 0],
}

const getMoveDirection = (topActive, leftActive, top, left) => {
  if (topActive === top && leftActive < left) {
    return 'rightScale';
  }
  if (topActive === top && leftActive > left) {
    return 'leftSacle'
  }
  if (topActive < top) {
    return 'down'
  }
  if (topActive > top) {
    return 'up'
  }
  return null
}


function GsapGridCard(props) {
  const { db, setDBFromServer, newsPreviewList, currentAssetId } = props;
  const [storedValue, saveToLocalStorage] = useLocalStorage('slide3D', INITIAL_CONFIG);
  const [zIndexes, setZindexes] = React.useState(new Array(db.length || 4));
  const [activeIdState, setActiveIdState] = React.useState(null);

  const [config, setConfig] = React.useState(INITIAL_CONFIG);
  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);

  const topRef = React.useRef(null);
  const videoContainersRef = React.useRef([]);
  const itemsRef = React.useRef([]);
  const lastZindex = React.useRef(1);

  const {contextSafe} = useGSAP({scope: topRef.current})

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

  const ease = 'power2.out'
  // const ease = 'bounce.out'
  // const ease = 'bounce.inOut'
  // const ease = 'elastic.out'
  // const ease = 'elastic.inOut'
  // const ease = 'expo.out'
  // const ease = 'steps'

  const gsapScaleUp = contextSafe((id) => {
    const target = videoContainersRef.current[id];
    const targetRect = target.getBoundingClientRect();
    const { top: topActive, left: leftActive } = targetRect;
    const style = getComputedStyle(target)
    console.log(`id=${target.id}, order=${style.order}`)
    const translateFactor = TRANSLATE_FACTOR[style.order]
    gsap.to(target, {
      scale: 2,
      x: `${translateFactor[0] * 50}%`,
      y: `${translateFactor[1] * 50}%`,
      duration: 3,
    });
    const otherVideos = videoContainersRef.current.filter(
      (videoContainer) => videoContainer.id !== id,
    );
    otherVideos.forEach((video) => {
      const boxRect = video.getBoundingClientRect();
      const { top, left } = boxRect;
      const moveDirection = getMoveDirection(topActive, leftActive, top, left)
      if (moveDirection === null) {
        // eslint-disable-next-line no-alert
        alert('no way to move')
      }
      const moveOutFactor = MOVE_OUT_FACTOR[moveDirection];
      // const scaleY = moveDirection !== 'up' && moveDirection !== 'down' ? 2 : 1;
      console.log(video, topActive, leftActive, top, left, moveDirection, moveOutFactor)
      gsap.to(video, {
        x: `${moveOutFactor[0] * 100}%`,
        y: `${moveOutFactor[1] * 100}%`,
        scaleY: 1,
        opacity: 1,
        duration: 3,
        ease
      })
    })
  })

  const scaleUp = React.useCallback((event) => {
    event.stopPropagation();
    const {id} = event.target;
    console.log('click:', id);
    event.target.parentNode.style.zIndex = lastZindex.current + 1;
    setActiveIdState(id)
    gsapScaleUp(id)
  }, [setActiveIdState]);

  return (
    <div>
      <Container ref={topRef} fontFamily={TITLE_FONT_FAMILY}>
        {db.map((item, i) => (
          <VideoContainer
            key={item.id}
            id={i}
            itemId={i}
            ref={(el) => (videoContainersRef.current[i] = el)}
            isActive={i === parseInt(activeIdState)}
            // onTransitionEnd={onTransitionEnd}
            // onClick={onClickItem}
            onClick={scaleUp}
            zIndex={zIndexes[i]}
            videoFilter={{ type: VIDEO_FILTER_TYPE, value: VIDEO_FILTER_VALUE }}
            transitionDelay={VIDEO_TRANSITION_DELAY}
          >
            {/* <Item
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
            <TitleContainer
              show={(item.title !== undefined && item.title.length !== 0)}
            >
              <Title
                id={i}
                // onClick={resetActiveId}
                fontSize={TITLE_FONT_SIZE}
                bgColor={TITLE_BAR_COLOR}
              >
                {item.title !== undefined && item.title.length !== 0 ? item.title:'H'}
              </Title>
            </TitleContainer> */}
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
  )
}

export default React.memo(GsapGridCard)
