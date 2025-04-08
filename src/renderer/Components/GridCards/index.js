/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import backImage from '../../assets/images/background.jpg';
import useLocalStorage from '../../hooks/useLocalStorage';
import defaultConfig from '../Slide3D/Config/defaultConfig';

const Container = styled.div`
  position: relative;
  display: grid;
  /* grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr; */
  grid-template-columns: repeat(2, 49%);
  grid-template-rows: repeat(2, 48%);
  justify-content: space-evenly;
  align-content: space-evenly;
  /* grid-gap: 20px; */
  /* padding: 20px; */
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  /* background-image: url(${backImage}); */
  background-size: cover;
`;
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: ${props => props.zIndex};
  /* z-index: ${(props) => props.isActive && 99}; */
  transform: ${(props) =>
    props.isActive &&
    // `translate(${props.translateFactor[0] * 50}%, ${props.translateFactor[1] * 50}%) scaleY(2.07) scaleX(2.1)`};
    `translate(${props.translateFactor[0] * 50.6}%, ${props.translateFactor[1] * 51.4}%) scale(2.15)`};
  /* transform: ${(props) => props.isActive && 'scale(2.05)'}; */
  /* transform-origin: top left; */
`;
const CustomButton = styled.div`
  position: absolute;
  bottom: 20px;
  right: 40px;
  font-size: 20px;
  background: transparent;
  backdrop-filter: blur(1px);
  padding: 5px;
  z-index: 100;
  opacity: 0.5;
`
const TitleContainer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
`
const Title = styled.div`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  /* backdrop-filter: blur(5px); */
  padding: 10px;
  box-sizing: border-box;
  font-size: 50px;
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
  /* padding: 10px; */
  border-radius: 30px;
  line-height: 200px;
  font-size: 50px;
  text-align: center;
  /* box-sizing: border-box; */
  /* outline: 2px rgba(189, 54, 54, 0.6) solid; */
`;
const QuitButton = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  min-height: 20px;
  min-width: 20px;
  background-color: transparent;
  left: 50%;
  top: 50%;
`
const INITIAL_CONFIG = defaultConfig;
const TRNSLATE_FACTOR = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

function GridCards(props) {
  const { db } = props;
  const [storedValue, saveToLocalStorage] = useLocalStorage('slide3D', INITIAL_CONFIG);
  const [zIndexes, setZindexes] = React.useState(new Array(db.length || 4));
  const [activeIdState, setActiveIdState] = React.useState(null);
  const [inTransition, setInTransition] = React.useState(false);
  const [config, setConfig] = React.useState(INITIAL_CONFIG);

  const videoContaiersRef = React.useRef([]);
  const itemsRef = React.useRef([]);
  const lastZindex = React.useRef(1);

  console.log('activeIDState', activeIdState)
  const LOCAL_MEDIA_PATH = config.mediaRoot;
  const USE_LOCAL_PATH = config.useLocalPath || false;
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

  const quitApp = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('quitApp');
  }, [])

  // const openDevTools = React.useCallback(() => {
  //   window.electron.ipcRenderer.sendMessage('openDevtools');
  // }, [])

  return (
    <div>
      <Container>
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
                <Title>{item.title}</Title>
              </TitleContainer>
            )}
          </VideoContainer>
        ))}
        <QuitButton onClick={quitApp} />
      </Container>
    </div>
  );
}

export default React.memo(GridCards);
