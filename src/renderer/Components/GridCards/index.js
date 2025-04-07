/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import backImage from '../../assets/images/background.jpg';
import defaultConfig from '../Slide3D/Config/defaultConfig';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;
  padding: 10px;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background-image: url(${backImage});
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
    `translate(${props.translateFactor[0] * 50}%, ${props.translateFactor[1] * 50}%) scale(2.1)`};
  /* transform: ${(props) => props.isActive && 'scale(2.05)'}; */
  /* transform-origin: top left; */
`;
const CustomButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  /* z-index: 100; */
`
const Item = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  line-height: 200px;
  font-size: 50px;
  text-align: center;
  box-sizing: border-box;
  outline: 2px rgba(189, 54, 54, 0.6) solid;
`;
const INITIAL_CONFIG = defaultConfig;
const TRNSLATE_FACTOR = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

function GridCards(props) {
  const { db } = props;
  const [zIndexes, setZindexes] = React.useState(new Array(db.length || 4));
  const [activeIdState, setActiveIdState] = React.useState(null);
  const [inTransition, setInTransition] = React.useState(false);
  const [config, setConfig] = React.useState(INITIAL_CONFIG);

  const videoContaiersRef = React.useRef([]);
  const itemsRef = React.useRef([]);

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

  const onClickItem = React.useCallback((e) => {
    console.log('onClickItem', e.target.id, e.target.style);
    const {id} = e.target;
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
      newArray[e.target.id] = 99;
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
    console.log('button clicked')
    setInTransition(true)
    e.stopPropagation();
    const resetZindexes = (event) => {
      console.log('reset zindex event:', event)
      if (event.propertyName === 'transform') {
        setZindexes(new Array(db.length || 4));
        setInTransition(false)
      }
    }
    e.target.parentElement.addEventListener('transitionend', resetZindexes, {
      once: true,
    });
    setActiveIdState(null);
  }, []);
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
                restore
              </CustomButton>
            )}
          </VideoContainer>
        ))}
      </Container>
    </div>
  );
}

export default React.memo(GridCards);
