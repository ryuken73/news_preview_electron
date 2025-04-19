/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import audioScaleUp from '../../assets/audio/scaleUp.mp3';
import audioScaleDown from '../../assets/audio/scaleDown.mp3';
import ConfigDialog from './Config/ConfigDialog';
import useLocalStorage from '../../hooks/useLocalStorage';
import defaultConfig from './Config/defaultConfig';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(Flip);

const Container = styled.div`
  font-family: ${(props) => props.fontFamily};
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
  background: black;
`;
const VideoContainer = styled.div`
  position: relative;
  background: black;
  color: white;
  width: calc(50% - 2rem);
  order: ${props => props.itemId};
  padding: 10px;
  border-radius: 20px;
  filter: ${(props) =>
    !props.isActive &&
    `${props.videoFilter.type}(${props.videoFilter.value}%)`};
`;
const Item = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  height: 100%;
  width: 100%;
  border-radius: 20px;
`;
const TitleContainer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  opacity: ${(props) => (props.show ? 1 : 0)};
`;
const Title = styled.div`
  width: 100%;
  background-color: ${(props) => props.bgColor || 'rgba(0, 0, 0, 0.4)'};
  padding: 10px;
  box-sizing: border-box;
  font-size: ${(props) => `${props.fontSize}px` || '50px'};
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const ConfigButton = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  min-height: 20px;
  min-width: 20px;
  background-color: transparent;
`;

const INITIAL_CONFIG = defaultConfig;
const AUTO_ROTATE = true;
const NEXT_INDEX_MAP = {
  0: 1,
  1: 3,
  3: 2,
  2: 0
};

const SCALE_UP_FACTOR = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

const MOVE_OUT_FACTOR = {
  leftDown: [-1, 0.5],
  rightDown: [1, 0.5],
  up: [0, -1],
  down: [0, 1],
  leftUp: [-1, -0.5],
  rightUp: [1, -0.5],
}

const getMoveDirection = (topActive, leftActive, top, left) => {
  if (topActive === top && leftActive < left) {
    return topActive === 0 ? 'rightDown':'rightUp';
  }
  if (topActive === top && leftActive > left) {
    return topActive === 0 ? 'leftDown':'leftUp';
  }
  return topActive < top ? 'down':'up';
}

export default React.memo(function FourByFour(props) {
  const {
    db: dbOriginal,
    setDBFromServer,
    newsPreviewList,
    currentAssetId,
  } = props;
  const [storedValue, saveToLocalStorage] = useLocalStorage(
    'slide3D',
    INITIAL_CONFIG,
  );
  const [zIndexes, setZindexes] = React.useState(
    new Array(dbOriginal.length || 4),
  );
  const [activeIdState, setActiveIdState] = React.useState(null);
  const topRef = React.useRef(null);
  const videoContainersRef = React.useRef([]);
  const [lastClickTime, setLastClickTime] = React.useState(null);

  const db = React.useMemo(() => {
    return [dbOriginal[1], dbOriginal[0], dbOriginal[2], dbOriginal[3]];
  }, [dbOriginal]);

  const [config, setConfig] = React.useState(storedValue);
  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);

  const [flipState, setFlipState] = React.useState(null);
  const zIndexRef = React.useRef(3);
  const itemsRef = React.useRef([]);

  console.log('stored config', config);

  const LOCAL_MEDIA_PATH = config.mediaRootGrid;
  const USE_LOCAL_PATH = config.useLocalPathGrid || false;
  const TITLE_FONT_SIZE = config.titleFontSizeGrid || 50;
  const TITLE_FONT_FAMILY = config.titleFontFamilyGrid || 'SUITE';
  const TITLE_BAR_COLOR = config.titleBarColorGrid || 'rgba(0, 0, 0, 0.4)';
  const VIDEO_FILTER_TYPE = config.videoFilterTypeGrid || 'saturate';
  const VIDEO_FILTER_VALUE = config.videoFilterValueGrid == undefined ? 20 : config.videoFilterValueGrid;
  const VIDEO_TRANSITION_DELAY =
    config.videoTransitionDelayGrid === undefined
      ? 0.2
      : config.videoTransitionDelayGrid;
  const REG_PATTERN = /http:\/\/.*\/(\d{8}\/.*\.mp4)/;

  const toLocalPath = React.useCallback(
    (remoteSrc) => {
      const match = remoteSrc.match(REG_PATTERN);
      if (match === null) {
        return remoteSrc;
      }
      const group = match[1];
      const localSrc = `${LOCAL_MEDIA_PATH}/${group}`;
      return localSrc;
    },
    [LOCAL_MEDIA_PATH, REG_PATTERN],
  );

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


  const toggleDialogOpen = React.useCallback(() => {
    setConfigDialogOpen((configDialogOpen) => !configDialogOpen);
  }, [])

  const activeOrderNumber = React.useMemo(() => {
    if (activeIdState === null) {
      return null
    }
    const activeBox = videoContainersRef.current.find((box) => {
      return box.id === activeIdState
    });
    return window.getComputedStyle(activeBox).order
  }, [activeIdState]);

  console.log('activeIdState', activeIdState)
  console.log('activeOrder Number', activeOrderNumber)

  const { contextSafe } = useGSAP({ scope: topRef.current });

  const getNextOrder = (boxElement) => {
    const style = window.getComputedStyle(boxElement)
    return NEXT_INDEX_MAP[parseInt(style.order)];
  }
  const reorderBoxRef = (array) => {
    return [array[2], array[0], array[3], array[1]];
  }

  const makeStagger = (shouldStartFirstIndex) => {
    return (index, target, list) => {
      const cssStyle = window.getComputedStyle(target)
      if (
        parseInt(shouldStartFirstIndex, 10) === parseInt(cssStyle.order, 10)
      ) {
        return 0;
      }
      const order = [0, 1, 3, 2];

      // activeIdState의 인덱스 찾기
      const activeIndex = order.indexOf(parseInt(shouldStartFirstIndex, 10));

      // input의 인덱스를 순서에 따라 계산
      let inputIndex = order.indexOf(parseInt(cssStyle.order, 10));


      // activeIdState 이후의 순서를 계산하기 위해 인덱스 조정
      inputIndex = (inputIndex - activeIndex + order.length) % order.length;
      console.log('########## should', shouldStartFirstIndex, cssStyle.order, activeIndex, inputIndex)
      // const weights = [0, 0.1, 0.25, 0.4];
      // const weights = [0, 0.4/3, 0.2, 0.4];
      // const weights = [0, 3, 6, 9];
      // const weights = [0, 0.2, 0.4, 0.6];
      const weights = [0, 0.1, 0.2, 0.3];
      // const weights = [0, 0.4, 0, 0.4];
      // activeIdState와 일치하지 않는 경우, 순서에 따라 0.1씩 증가
      console.log('duraion:', inputIndex*0.3)
      return weights[inputIndex] ;
      // return  0
    }
  }

  useGSAP(() => {
    if(lastClickTime === null){
      return
    }
    // Flip.from으로 해보자.
    videoContainersRef.current.forEach(box => {
      console.log('before', box.id, window.getComputedStyle(box).order)
      console.log(flipState)
    })
    const state = flipState === null ? Flip.getState(videoContainersRef.current, {props: "order"}) : flipState;
    console.log(state)
    videoContainersRef.current.forEach((box, i) => {
      const nextOrder = getNextOrder(box)
      box.style.order = nextOrder
    })
    const masterTimeline = gsap.timeline();
    const flipTimeline = Flip.from(state, {
      duration: 0.2,
      // duration: 1,
      // spin: true,
      // stagger: {
      //   from: activeIdState,
      //   amount : 1
      // },
      stagger: makeStagger(activeOrderNumber),
      absolute: true,
      fade: true,
      ease: 'power1.out',
      // ease: 'elastic.out(1, 0.9)',
      onEnter: (elements) =>
        gsap.fromTo(elements, { opacity: 1 }, { opacity: 0.5 }),
      onComplete: () => {
        setActiveIdState(null)
        setFlipState(Flip.getState(videoContainersRef.current, {props: "order"}))
        videoContainersRef.current = reorderBoxRef(videoContainersRef.current)
      }
    })
    masterTimeline.pause();
    masterTimeline.add(flipTimeline)
    // masterTimeline.add(gsap.to(videoContainersRef.current, {scale: 0.7, duration: 0.1}), "<")
    // masterTimeline.add(gsap.to(videoContainersRef.current, {scale: 1, duration: 0.1}), "<+0.1")
    masterTimeline.play();
  }, {scope: topRef.current, dependencies:[lastClickTime], revertOnUpdate: true})


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
    const translateFactor = SCALE_UP_FACTOR[style.order]
    gsap.to(target, {
      scale: 2.1,
      x: `${translateFactor[0] * 50}%`,
      y: `${translateFactor[1] * 50}%`,
      duration: 0.5,
      ease
    })
    const otherBoxes = videoContainersRef.current.filter(
      (box) => box.id !== id,
    );
    otherBoxes.forEach(box => {
      const boxRect = box.getBoundingClientRect();
      const { top, left } = boxRect;
      const moveDirection = getMoveDirection(topActive, leftActive, top, left)
      if (moveDirection === null) {
        console.error('no way to move')
      }
      const moveOutFactor = MOVE_OUT_FACTOR[moveDirection];
      const scaleY = moveDirection !== 'up' && moveDirection !== 'down' ? 2 : 1;
      console.log('moveDirection:', box, topActive, leftActive, top, left, moveDirection, moveOutFactor, scaleY)
      gsap.to(box, {
        x: `${moveOutFactor[0] * 100}%`,
        y: `${moveOutFactor[1] * 100}%`,
        scaleY,
        opacity: 1,
        duration: 0.5,
        ease
      })
    })
  })

  const gsapScaleDown = contextSafe((id) => {
    const target = videoContainersRef.current[id]
    console.log(target)
    gsap.to(videoContainersRef.current, {
      scale: 1,
      x: '0',
      y:'0',
      duration: 0.5,
      ease,
      onComplete: () => {
        if (AUTO_ROTATE) {
          setLastClickTime(Date.now());
        }
      }
    })
    const otherBoxes = videoContainersRef.current.filter(
      (box) => box.id !== id,
    );
    otherBoxes.forEach((box) => {
      gsap.to(box, {
        x: `0%`,
        y: `0%`,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease
      });
    });
  });

  const scaleUp = React.useCallback((event) => {
    event.stopPropagation();
    const { id } = event.target;
    if (id === '') {
      return;
    }
    const currentPlayer = itemsRef.current[id];
    if (id === activeIdState) {
      // eslint-disable-next-line no-unused-expressions
      currentPlayer.paused ? currentPlayer.play() : currentPlayer.pause();
      return;
    }
    console.log('click:', id);
    event.target.parentNode.style.zIndex = zIndexRef.current + 1;
    zIndexRef.current += 1;
    gsapScaleUp(id)
    setActiveIdState(id)
    new Audio(audioScaleUp).play();
    },
    [activeIdState, gsapScaleUp],
  );

  const scaleDown = React.useCallback((event) => {
    event.stopPropagation();
    const { id } = event.target;
    if (id !== activeIdState) {
      console.log('item is not activeState', typeof(id),id, typeof(activeIdState), activeIdState)
      return;
    }
    const currentPlayer = itemsRef.current[id];
    currentPlayer.pause();
    gsapScaleDown(id)
    new Audio(audioScaleDown).play();
  }, [activeIdState, gsapScaleDown])

  return (
    <Container ref={topRef} fontFamily={TITLE_FONT_FAMILY}>
      {db.map((item, i) => (
        <VideoContainer
          key={item.id}
          id={i}
          itemId={i}
          ref={(el) => (videoContainersRef.current[i] = el)}
          isActive={i === parseInt(activeIdState, 10)}
          onClick={scaleUp}
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
            isActive={i === parseInt(activeIdState, 10)}
            muted
          />
          <TitleContainer
            show={item.title !== undefined && item.title.length !== 0}
          >
            <Title
              id={i}
              onClick={scaleDown}
              fontSize={TITLE_FONT_SIZE}
              bgColor={TITLE_BAR_COLOR}
            >
              {item.title !== undefined && item.title.length !== 0 ? item.title:'H'}
            </Title>
          </TitleContainer>
        </VideoContainer>
      ))}
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
       />
    </Container>
  )
})
