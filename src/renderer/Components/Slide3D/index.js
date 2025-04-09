/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled, {keyframes, css} from 'styled-components';
import backImage from '../../assets/images/background.jpg';
import backgroundImage from '../../assets/images/BACK.jpg';
import audioTouch from '../../assets/audio/touch.mp3';
import audioScaleUp from '../../assets/audio/scaleUp.mp3';
import audioScaleDown from '../../assets/audio/scaleDown.mp3';
import vBarImage from '../../assets/images/vBar.png';
import RightSide from './RightSide';
import ConfigDialog from './Config/ConfigDialog';
// import SnowBackground from './SnowBackground';
// import RainBackground from './RainBackground';
import useLocalStorage from '../../hooks/useLocalStorage';
import defaultConfig from './Config/defaultConfig';

const spinRandom = keyframes`
  from {
    -webkit-transform: rotateY(0deg) rotateX(${Math.random() * -18}deg) rotateZ(${Math.random() * -18}deg);
    transform: rotateY(0deg) rotateX(${Math.random() * -18}deg) rotateZ(${Math.random() * -18}deg);
  }
  to {
    -webkit-transform: rotateY(-360deg) rotateX(${Math.random() * -18}deg) rotateZ(${Math.random() * -180}deg);
    transform: rotateY(-360deg) rotateX(${Math.random() * -18}deg) rotateZ(${Math.random() * -18}deg);
  }
`
const spin = keyframes`
  from {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }
  to {
    -webkit-transform: rotateY(-360deg);
    transform: rotateY(-360deg);
  }
`
const spinStyle = css`
  animation-name: ${spin};
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`
const TopContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 200%;
  perspective: 4000px;
  overflow: hidden;
  min-height: 100vh;
  background-image: url(${backImage});
  background-size: cover;
`
const Container = styled.div`
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: auto;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotateX(0deg) rotateY(0deg);
  transform: rotateX(0deg) rotateY(0deg);
  width: 100%;
  height: 100%;
  margin-bottom: ${props => props.moveUpward === 0 ? 'auto' : `${props.moveUpward}px`};
`
const SpinContainer = styled(Container)`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  ${props => props.autoRotate && spinStyle};
  animation-duration: ${props => `${props.rotationTime}s`};
  animation-play-state: ${props => props.animationPaused ? 'paused':'running'};
  filter: ${props => `brightness(${props.stackOpacity})`};
`
const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  border-radius: 10px;
  transform-origin: ${props => props.scaleOrigin === 300 ? 'center center':`center ${props.scaleOrigin}px`};
`
const Backface = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-image: url(${backgroundImage});
  background-size: cover;
  opacity: 1;
  border-radius: 10px;
  backface-visibility: hidden;
  transform: rotateY( 180deg );
  -webkit-box-reflect: below 10px
    linear-gradient(transparent, transparent, #0005);
`
const titleStyles = [
  'white',
  'linear-gradient(114deg, rgb(10, 12, 70), rgb(12, 81, 197))',
  'linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 60, 80) 93.4%)',
  'linear-gradient(109.6deg, rgb(20, 30, 48) 11.2%, rgb(36, 59, 85) 91.1%)',
  'linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%)',
  'linear-gradient(175deg, rgb(2, 0, 97) 15%, rgb(2, 80, 219) 158.5%)',
  'radial-gradient(circle at 85.4% 50.8%, rgb(14, 72, 222) 0%, rgb(3, 22, 65) 74.2%)',
  'linear-gradient(115.7deg, rgb(3, 79, 135) 6.2%, rgb(0, 184, 214) 112.9%)',
]
const scaleStyles = [
  'cubic-bezier(.85,-0.13,.95,-0.11)',
  'ease',
  'cubic-bezier(.57,-0.9,.76,1.66)',
  'cubic-bezier(.21,-0.43,.57,-0.14)',
  'cubic-bezier(.29,-0.21,.58,-0.05)',
  'cubic-bezier(.53,-0.21,.95,-0.11)',
  'cubic-bezier(.7,-0.18,.95,-0.11)'
]
const VideoTitle = styled.div`
  position: absolute;
  top: 0px;
  background: ${props => titleStyles[props.titleStyle-1]};
  color: ${props => props.titleStyle === "1" ? 'black':'white'};
  opacity: 1;
  letter-spacing: -1px;
  font-size: ${props => `${props.titleFontSize}px` || '20px'};
  font-weight: ${props => props.titleFontWeight || 100};
  opacity: ${props => props.titleOpacity === undefined ? 0.7 : props.titleOpacity};
  padding: 4px;
  box-sizing: border-box;
  backface-visibility: hidden;
  width: ${props => props.titleType === 'fullWidth' ? '100%' : 'auto'};
  padding-left: ${props => props.titleType === 'fullWidth' ? '20px' : '30px'};
  padding-right: ${props => props.titleType === 'center' && '30px'};
  min-width: ${props => props.titleType === 'center' && '30%'};
  text-align: ${props => props.titleType === 'fullWidth' ? 'left':'center'};
  border-top-left-radius: ${props => props.titleType === 'fullWidth' && '10px'};
  border-top-right-radius: ${props => props.titleType === 'fullWidth' && '10px'};
  border-bottom-left-radius: ${props => props.titleType === 'center' && '10px'};
  border-bottom-right-radius: ${props => props.titleType === 'center' && '10px'};
  left: ${props => props.titleType === 'center' && '50%'};
  transform: ${props => props.titleType === 'center' && 'translate(-50%, 0)'};
  display: flex;
  align-items: center;
`
const TitleContainer = styled.div`
  position: absolute;
  top: 0px;
  opacity: 1;
  width: 100%;
  z-index: ${props => props.zIndex};
`
const TransparentTitle = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: left;
  padding-left: 20px;
  font-weight: 100;
  font-size: ${props => `${props.titleFontSize}px` || '20px'};
  font-weight: ${props => props.titleFontWeight || 100};
`
const StyledHr = styled.hr`
  margin-top: 0px;
  width: 95%;
`
const LogContainer = styled.div`
  margin: auto;
`
const LogoText = styled.div`
  font-size: 100px;
  font-weight: bold;
`
const ItemMirror = styled.video`
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  position: absolute;
  backface-visibility: hidden;
  object-fit: cover;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  line-height: 200px;
  font-size: 50px;
  text-align: center;
  -webkit-box-shadow: 0 0 1px #fff;
  box-shadow: 0 0 1px #fff;
  box-sizing: border-box;
  transform: ${props => `translateY(${props.gap}px) scale(1, -1)`};
  -webkit-mask-image: linear-gradient(transparent, transparent, #0007);
  z-index: -100;
`
const Item = styled.video`
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  position: absolute;
  object-fit: cover;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  line-height: 200px;
  font-size: 50px;
  text-align: center;
  -webkit-box-shadow: ${props => props.isActive ? '0 0 2px #fff': '0 0 1px #fff'};
  box-shadow: ${props => props.isActive ? '0 0 2px #fff': '0 0 1px #fff'};
  box-sizing: border-box;
  outline: 2px rgba(255,255,255,0.6) solid;
`
const Ground = styled.div`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  position: absolute;
  top: 100%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) rotateX(90deg);
  transform: translate(-50%, -50%) rotateX(90deg);
`
const BottomDummy = styled.div`
  height: 300px;
`
const Title = styled.div``
const StyledSpan = styled.div`
  margin-right: 10px;
`
const BarImage = styled.img`
  /* margin-right: 10px; */
  margin-right: ${props => `${2*(props.titleFontSize/10 - 1) + 7}px`};
  height: ${props => `${props.titleFontSize * 0.8}px`};
`
// const radius = 800; // how big of the radius
const CLASS_FOR_POINTER_EVENT_FREE = 'buttonClass';
const INITIAL_CONFIG = defaultConfig;

const makePlayerFront = (element, degree) => {
  element.style.transform = `rotateX(0deg) rotateY(${degree * -1}deg)`
}
const removeTransition = element => {
  element.style.transition = 'none';
}

// const AUTO_PLAY = true;
const USE_STATIC_TY = false;
const TY = 10;

function Slide3D(props) {
  const { db, parentRef, currentAssetId, newsPreviewList, setDBFromServer } = props;
  const [storedValue, saveToLocalStorage] = useLocalStorage('slide3D', INITIAL_CONFIG);
  const [animationPaused, setAnimationPaused] = React.useState(false);
  const [activeIdState, setActiveIdState] = React.useState(null);
  const [currentPlayingId, setCurrentPlayingId] = React.useState(null);
  const [currentScaledUpId, setCurrentScaledUpId] = React.useState(null);
  const [underTransition, setUnderTransition] = React.useState(false);
  const [mirrorErr, setMirrorErr] = React.useState(false);

  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);
  const [config, setConfig] = React.useState(INITIAL_CONFIG);

  const dragRef = React.useRef(null);
  const spinRef = React.useRef(null);
  const videoContaiersRef = React.useRef([])
  const videoTitleRef = React.useRef([]);
  const itemsRef = React.useRef([]);
  const itemMirrorsRef = React.useRef([]);
  const buttonsRef = React.useRef([]);
  const timerRef = React.useRef();
  const eventTimerRef = React.useRef(null);
  const initAnimationRef = React.useRef(null);
  const startXY = React.useRef({x:0, y:0});
  const destXY = React.useRef({x:0, y:0});
  const targetXY = React.useRef({x:0, y:0});
  // console.log(startXY, destXY, targetXY)
  console.log('##', config, db, currentAssetId)

  const ANIMATION_SECONDS = config.animationTime;
  const ANIMATION_MILLI_SECONDS = config.animationTime * 1000;
  const USE_LOCAL_PATH = config.useLocalPath || false;
  const LOCAL_MEDIA_PATH = config.mediaRoot;
  const EASE_FUNC = scaleStyles[parseInt(config.scaleStyle, 10) - 1];
  console.log('#####', EASE_FUNC)

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

  const setAutoRotate = React.useCallback((autoRotate) => {
    if(!config.autoRotateInSetting){
      // if autoRotate is disable by setting, skip action
      return;
    }
    console.log('### set autoRotate:', autoRotate)
    setConfig(config => {
      return {
        ...config,
        autoRotate
      }
    })
  }, [])

  // initialize config from localStorage
  React.useEffect(() => {
    console.log('load from localStorage to config:', storedValue)
    setConfig(storedValue)
  }, [storedValue])

  const onPlay = React.useCallback((event) => {
    console.log('event: play start',event.target.id)
    const id = event.target.id;
    setCurrentPlayingId(id)
  }, [])

  const onPause = React.useCallback((event) => {
    console.log('event: play paused', event.target.id);
    setCurrentPlayingId(null)
  }, [])

  const onEnded = React.useCallback((event) => {
    console.log('event: play end',event.target.id)
    const playEndPlayerId = event.target.id;
    if(config.autoPlay){
      const nextId = parseInt(playEndPlayerId) + 1;
      if(nextId === db.length) {
        console.log('end reached');
      } else {
        console.log('event:',playEndPlayerId, nextId, itemsRef.current)
        setTimeout(() => {
          buttonsRef.current[nextId].click();
        }, 700)
      }
    }
    setCurrentPlayingId(null)
  }, [config.autoPlay, db.length])

  const runInitialAnimation = React.useCallback(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('event: end')
        resolve(true)
      }, ANIMATION_MILLI_SECONDS + 800)
      console.log('event: start')
      spinRef.current.style.filter = 'none';
      videoContaiersRef.current.forEach((videoContainerRef,i) => {
        console.log('apply animation', videoContainerRef)
        if(videoContainerRef === null) return;
        videoContainerRef.style.transform = `rotateY(${i * (360/db.length)}deg) translateZ(${config.radius}px)`;
        videoContainerRef.style.transition = `transform ${ANIMATION_SECONDS}s`;
        videoContainerRef.style.transitionDelay = `${(db.length - i)/4}s`
      })
    })
  }, [ANIMATION_SECONDS, ANIMATION_MILLI_SECONDS, db, config.radius])

  const unFoldPlayer = React.useCallback(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('event: end')
        setAutoRotate(false);
        resolve(true)
      }, ANIMATION_MILLI_SECONDS + 800)
      console.log('event: start')
      spinRef.current.style.filter = `brightness(${config.stackOpacity})`;
      videoContaiersRef.current.forEach((videoContainerRef,i) => {
        console.log('remove animation', videoContainerRef)
        if(videoContainerRef === null) return;
        videoContainerRef.style.transform = `none`;
        videoContainerRef.style.transition = `transform ${ANIMATION_SECONDS}s`;
        videoContainerRef.style.transitionDelay = `${(db.length - i)/4}s`
      })
      resetFilterFromAllPlayer();
    })
  }, [config.stackOpacity])

  React.useEffect(() => {
    console.log('db.length=', db.length, config.startWithStacked);
    clearTimeout(initAnimationRef.current);
    initAnimationRef.current = setTimeout(() =>{
      console.log('apply animation', config.startWithStacked)
      if(config.startWithStacked) {
        console.log('startWithStacked enabled! stop autoRotate')
        setAutoRotate(false);
        return;
      }
      runInitialAnimation();
    }, 1000)
    itemsRef.current.forEach((itemRef, i) => {
      if(itemRef === null) return;
      itemRef.addEventListener('play', onPlay);
      itemRef.addEventListener('pause', onPause);
      itemRef.addEventListener('ended', onEnded);
      itemRef.addEventListener('canplay', () => {
        const mediaStream = itemRef.captureStream(0);
        itemMirrorsRef.current[i].srcObject = mediaStream;
        itemMirrorsRef.current[i].play()
        .then(() => {
          console.log('auto play done');
        })
        .catch((err) => {
          console.log('play error:', err)
          setMirrorErr(true);
        })
        console.log(itemMirrorsRef.current[i], mediaStream)
      });
    })
    return () => {
      itemsRef.current.forEach((itemRef) => {
        if(itemRef === null) return;
        itemRef.removeEventListener('play', onPlay );
        itemRef.removeEventListener('pause', onPause );
        itemRef.removeEventListener('ended', onEnded );
      })
    }
  }, [
    config.autoPlay,
    config.startWithStacked,
    config.radius,
    db,
    itemsRef,
    onEnded,
    onPause,
    onPlay,
    runInitialAnimation
  ])

  const mirrorPlayer = React.useCallback(() => {
    setMirrorErr(false);
    itemsRef.current.forEach((itemRef, i) => {
      if(itemRef === null) return;
      const mediaStream = itemRef.captureStream(0);
      itemMirrorsRef.current[i].srcObject = mediaStream;
      itemMirrorsRef.current[i].play()
      .then(() => {
        console.log('auto play done');
      })
      .catch((err) => {
        console.log('play error:', err)
        setMirrorErr(true);
      })
      console.log(itemMirrorsRef.current[i], mediaStream)
    });
  }, []);

  console.log('current Playing Id = ', currentPlayingId)
  console.log('current Active Id = ', activeIdState)

  const stopPlayerById = React.useCallback((playerId) => {
    const player = itemsRef.current[playerId];
    const videoContainer = videoContaiersRef.current[playerId]
    videoContainer.style.transform = videoContainer.style.transform.replace(/scale(.*)/, '');
    player?.pause();
  }, [])

  const enableAutoRotate = React.useCallback(() => {
    setAutoRotate(true)
  }, [setAutoRotate])

  const disableAutoRotate = React.useCallback(() => {
    setAutoRotate(false)
  }, [setAutoRotate])

  const moveFront = React.useCallback((container, clickedPlayerId, offset=0) => {
    return new Promise((resolve, reject) => {
      eventTimerRef.current = null;
      eventTimerRef.current = setTimeout(() => {
        console.log('event: remove moveFront:')
        removeTransition(container)
        resolve(true)
      }, ANIMATION_MILLI_SECONDS)
      console.log('event: add moveFront:', clickedPlayerId, offset)
      // container.addEventListener('transitionend', resolvePromise);
      setActiveIdState(clickedPlayerId);
      const ty = USE_STATIC_TY ? TY : targetXY.current.y;
      const tx = clickedPlayerId * ((360/db.length) * -1) + offset;
      container.style.transition = `transform ${ANIMATION_SECONDS}s`;
      container.style.transform = `rotateX(${-ty}deg) rotateY(${tx}deg)`;
      targetXY.current.y = ty;
      targetXY.current.x = tx;
    })
  }, [ANIMATION_MILLI_SECONDS, ANIMATION_SECONDS, db.length])

  const scaleUp = React.useCallback((container, targetId) => {
    return new Promise((resolve, reject) => {
      eventTimerRef.current = null;
      eventTimerRef.current = setTimeout(() => {
        setCurrentScaledUpId(targetId)
        console.log('event: remove scaleUp:', targetId)
        resolve(true)
      }, ANIMATION_MILLI_SECONDS);

      console.log('event: add scaleUp:', targetId)
      // container.addEventListener('transitionend', resolvePromise);
      const isAlreadyScaleUp = /scale(.*)/.test(container.style.transform)
      console.log('event: ',container.style.transform, isAlreadyScaleUp, config, config.videoScale)
      if(isAlreadyScaleUp) return;
      container.style.transition = `${ANIMATION_SECONDS}s ${EASE_FUNC}`;
      container.style.transform += `scale(${config.videoScale})`;
      new Audio(audioScaleUp).play();
    })
  }, [ANIMATION_MILLI_SECONDS, ANIMATION_SECONDS, config])

  const scaleDown = React.useCallback((container, isLastItem) => {
    return new Promise((resolve, reject) => {
      eventTimerRef.current = null;
      eventTimerRef.current = setTimeout(() => {
        setCurrentScaledUpId(null)
        setActiveIdState(null)
        console.log('event: remove scaleDown:')
        resolve(true)
      }, ANIMATION_MILLI_SECONDS)
      // container.addEventListener('transitionend', resolvePromise);
      isLastItem && new Audio(audioScaleDown).play();
      container.style.transition = `${ANIMATION_SECONDS}s ${EASE_FUNC}`;
      container.style.transform = container.style.transform.replace(/scale(.*)/, '');
    })
  }, [ANIMATION_MILLI_SECONDS, ANIMATION_SECONDS])

  const playById = React.useCallback((player, targetId) => {
    player?.play();
  }, [])

  const pauseById = React.useCallback((player, targetId) => {
    player?.pause();
  }, [])

  const resetFilterFromAllPlayer = React.useCallback(() => {
    itemsRef.current.forEach((player) => {
      if(player === null) return;
      player.style.filter = '';
    })
  }, [])
  const setGrayFilterToAllPlayer = React.useCallback(() => {
    itemsRef.current.forEach((player) => {
      if(player === null) return;
      player.style.filter = 'grayscale(1) brightness(30%)';
    })
  }, [])

  const setStandby = React.useCallback((options) => {
    const {isLast=false, setAllPlayerGray} = options;
    if(!isLast){
      const applyLocalStroage = false;
      updateConfig('rotationTime', config.rotationTime, applyLocalStroage);
    }
    dragRef.current.style.transition = 'transform 1s';
    dragRef.current.style.transform = `rotateX(${config.degreeOfLast * -1}deg) rotateY(-480deg)`;
    if(setAllPlayerGray){
      setGrayFilterToAllPlayer();
    } else {
      resetFilterFromAllPlayer();
    }
    setTimeout(() => {
      dragRef.current.style.transition = 'none';
    }, 1000);
  }, [config.degreeOfLast])

  const onClickButton = React.useCallback(async (event) => {
    if(underTransition){
      return;
    }
    setUnderTransition(true);
    const targetId = event.target.id;
    const spinContainer = dragRef.current;
    const spinElement = spinRef.current;
    const videoContainer = videoContaiersRef.current[targetId];
    const currentPlayer = itemsRef.current[targetId];
    disableAutoRotate()
    const clickedWhenOtherScaledUp = currentScaledUpId !== null;
    const clickedScaledElement = clickedWhenOtherScaledUp && currentScaledUpId === targetId;
    if(clickedScaledElement){
      console.log('event: Force Quit: clicked already Scaled Up element');
      pauseById(currentPlayer, targetId)
      if(config.greyForDoneItem){
        currentPlayer.style.filter = 'grayscale(1) brightness(30%)';
      }
      const isLastItem = parseInt(targetId) === db.length - 1;
      await scaleDown(videoContainer, isLastItem);
      // await moveFront(spinContainer, targetId, -2);
      setUnderTransition(false);
      enableAutoRotate();
      // const isLastItem = parseInt(targetId) === db.length - 1;
      if(isLastItem){
        const applyLocalStroage = false;
        updateConfig('rotationTime', config.rotationTimeLast, applyLocalStroage);
        setStandby({
          isLast: true,
          setAllPlayerGray: config.greyForDoneAll
        })
      }
      return;
    }
    new Audio(audioTouch).play();
    if(clickedWhenOtherScaledUp){
      console.log('event: Normal Next: other ScaledUp exists');
      const scaledContainer = videoContaiersRef.current[currentScaledUpId];
      const scaledPlayer = itemsRef.current[currentScaledUpId];
      pauseById(scaledPlayer, currentScaledUpId);
      if(config.greyForDoneItem){
        scaledPlayer.style.filter = 'grayscale(1) brightness(30%)';
      }
      await scaleDown(scaledContainer)
    }
    const spinRefStyle = window.getComputedStyle(spinRef.current);
    console.log('xx', spinRefStyle.filter)
    const isFirstClick = /brightness\(/.test(spinRefStyle.filter);
    if(config.startWithStacked && targetId === '0' && isFirstClick) {
      await runInitialAnimation();
    }
    console.log('event: Move first or Next player');
    await moveFront(spinContainer, targetId);
    playById(currentPlayer, targetId);
    if(config.greyForDoneItem){
      currentPlayer.style.filter = '';
    }
    await scaleUp(videoContainer, targetId);
    setUnderTransition(false);
  }, [
    currentScaledUpId,
    enableAutoRotate,
    disableAutoRotate,
    moveFront,
    pauseById,
    playById,
    scaleDown,
    scaleUp,
    setStandby,
    underTransition,
    config
  ])

  const toggleAnimationPaused = React.useCallback(() => {
    setAnimationPaused(animationPaused => {
      return !animationPaused
    })
  }, [])

  const applyTransform = React.useCallback(() => {
    console.log('^^^ applyTransform')
    if(targetXY.current.y > 180) targetXY.current.y = 180;
    if(targetXY.current.y < 0) targetXY.current.y = 0;
    const ty = targetXY.current.y
    const tx = targetXY.current.x
    dragRef.current.style.transform = `rotateX(${-ty}deg) rotateY(${tx}deg)`;
  }, [])

  const startPlayFromFirst = React.useCallback(() => {
    console.log('start play first:',buttonsRef.current);
    buttonsRef.current[0].click();
  }, [])

  const stopPlayerCurrent = React.useCallback(() => {
    stopPlayerById(currentPlayingId)
    setAnimationPaused(false)
    setAutoRotate(true)
  }, [currentPlayingId, setAutoRotate, stopPlayerById])

  React.useEffect(() => {
    parentRef.current.onpointerdown = (e) => {
      clearInterval(timerRef.current);
      e = e || window.event;
      startXY.current.x = e.clientX;
      startXY.current.y = e.clientY;
      parentRef.current.onpointermove = (e) => {
        const moveElement = document.elementsFromPoint(e.clientX, e.clientY);
        console.log(e.clientX, e.clientY, moveElement)
        // const ignoreEvent = moveElement.classList.contains(CLASS_FOR_POINTER_EVENT_FREE);
        const ignoreEvent = moveElement.some((element) => {
          return element.classList.contains(CLASS_FOR_POINTER_EVENT_FREE);
        })
        if(ignoreEvent) {
          return;
        }
        console.log('move event')
        e = e || window.event;
        const nX = e.clientX;
        const nY = e.clientY;
        destXY.current.x = nX - startXY.current.x;
        destXY.current.y = nY - startXY.current.y;
        targetXY.current.x += destXY.current.x * 0.1;
        targetXY.current.y += destXY.current.y * 0.1;
        console.log('mouse move event')
        applyTransform()
        startXY.current.x = nX;
        startXY.current.y = nY;
      }
      parentRef.current.onpointerup = (e) => {
        const upElement = document.elementsFromPoint(e.clientX, e.clientY);
        console.log('upElement:', upElement)
        console.log(e.clientX, e.clientY, upElement)
        // const ignoreEvent = upElement.classList.contains(CLASS_FOR_POINTER_EVENT_FREE);
        const ignoreEvent = upElement.some((element) => {
          return element.classList.contains(CLASS_FOR_POINTER_EVENT_FREE);
        })
        if(ignoreEvent) {
          parentRef.current.onpointermove = parentRef.current.onpointerup = null
          return;
        }
        console.log('up event')
        timerRef.current = setInterval(() => {
          destXY.current.x *= 0.95;
          destXY.current.y *= 0.95;
          targetXY.current.x += destXY.current.x * 0.1;
          targetXY.current.y += destXY.current.y * 0.1;
          console.log('mouse up event')
          applyTransform();
          setAnimationPaused(true);
          if(Math.abs(destXY.current.x) < 0.5 && Math.abs(destXY.current.y) < 0.5) {
            clearInterval(timerRef.current);
            setAnimationPaused(false);
          }
        }, 17)
        parentRef.current.onpointermove = parentRef.current.onpointerup = null
      }
    }
    return () => {
      clearInterval(timerRef.current);
      parentRef.current.onpointerdown = null;
    }
  }, [applyTransform, parentRef])

  const idleVideoHeight = config.idleVideoWidth * (9/16);
  const reflectionGap = idleVideoHeight + 10;

  const REG_PATTERN = /http:\/\/.*\/(\d{8}\/.*\.mp4)/;
  const toLocalPath = React.useCallback((remoteSrc) => {
    const match = remoteSrc.match(REG_PATTERN);
    if(match === null){
      return remoteSrc;
    }
    const group = match[1];
    const localSrc = `${LOCAL_MEDIA_PATH}/${group}`;
    console.log(localSrc)
    return localSrc
  })

  return (
    <TopContainer>
      {/* <SnowBackground></SnowBackground> */}
      {/* <RainBackground></RainBackground> */}
      <Container
        ref={dragRef}
        transitionType="rotate"
        moveUpward={config.moveUpward}
      >
        <SpinContainer
          ref={spinRef}
          stackOpacity={config.stackOpacity}
          autoRotate={config.autoRotate}
          animationPaused={animationPaused}
          width={config.idleVideoWidth}
          height={idleVideoHeight}
          rotationTime={config.rotationTime}
        >
          {db.map((item, i) => (
            <VideoContainer
              key={item.id}
              ref={el => videoContaiersRef.current[i] = el}
              transitionType="scale"
              scaleOrigin={config.scaleOrigin}
            >
              <Item
                crossOrigin="anonymous"
                id={i}
                src={USE_LOCAL_PATH ? toLocalPath(item.src) : item.src}
                ref={el => itemsRef.current[i] = el}
                itemIndex={i}
                itemLength={db.length}
                radius={config.radius}
                isActive={i === parseInt(activeIdState)}
                muted
              >
              </Item>
              <ItemMirror
                playsinline
                autoplay
                id={i}
                ref={el => itemMirrorsRef.current[i] = el}
                gap={reflectionGap}
                muted
              ></ItemMirror>
              {config.titleType !== 'transparent' && (
                <VideoTitle
                  ref={el => videoTitleRef.current[i] = el}
                  titleFontSize={config.titleFontSize}
                  titleFontWeight={config.titleFontWeight}
                  titleOpacity={config.titleOpacity}
                  titleType={config.titleType}
                  titleStyle={config.titleStyle}
                >
                  {config.titleType === 'fullWidth' && (
                    // <StyledSpan>
                      <BarImage titleFontSize={config.titleFontSize} src={vBarImage} />
                    // </StyledSpan>
                  )}
                  <Title>
                    {item.title}
                  </Title>
                </VideoTitle>
              )}
              {config.titleType === 'transparent' && (
                <TitleContainer
                  zIndex={(i*-1) + 100}
                >
                  <TransparentTitle
                    ref={el => videoTitleRef.current[i] = el}
                    titleFontSize={config.titleFontSize}
                    titleFontWeight={config.titleFontWeight}
                    titleOpacity={config.titleOpacity}
                  >
                    {item.title}
                  </TransparentTitle>
                  <StyledHr></StyledHr>
                </TitleContainer>
              )}
              <Backface>
              </Backface>
            </VideoContainer>
          ))}
        </SpinContainer>
        <Ground width={config.radius*3} height={config.radius*3}></Ground>
      </Container>
      <RightSide
        db={db}
        config={config}
        mirrorErr={mirrorErr}
        underTransition={underTransition}
        currentPlayingId={currentPlayingId}
        activeIdState={activeIdState}
        buttonsRef={buttonsRef}
        updateConfig={updateConfig}
        onClickButton={onClickButton}
        toggleDialogOpen={toggleDialogOpen}
        unFoldPlayer={unFoldPlayer}
        setStandby={setStandby}
        mirrorPlayer={mirrorPlayer}
        startPlayFromFirst={startPlayFromFirst}
        stopPlayerCurrent={stopPlayerCurrent}

      ></RightSide>
      <ConfigDialog
        configDialogOpen={configDialogOpen}
        toggleDialogOpen={toggleDialogOpen}
        config={config}
        setConfig={setConfig}
        updateConfig={updateConfig}
        saveToLocalStorage={saveToLocalStorage}
        defaultConfig={INITIAL_CONFIG}
        runInitialAnimation={runInitialAnimation}
        currentAssetId={currentAssetId}
        newsPreviewList={newsPreviewList}
        setDBFromServer={setDBFromServer}
      ></ConfigDialog>
    </TopContainer>
  )
}

export default Slide3D;
