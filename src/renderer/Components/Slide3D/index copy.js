import React from 'react';
import styled, {keyframes, css} from 'styled-components';
import backgroundImage from '../../assets/images/BACK.jpg'

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
  animation-duration: 60s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`
const TopContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  perspective: 4000px;
  overflow: hidden;
  min-height: 100vh;
`
const Container = styled.div`
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: auto;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotateX(-0.1deg) rotateY(0deg);
  transform: rotateX(-0.1deg) rotateY(0deg);
  width: 100%;
  height: 100%;
`
const ControlContainer = styled.div`
  display: flex;
  min-width: 150px;
  max-width: 150px;
`
const Buttons = styled.div`
  min-width: 100px;
  margin: auto;
`
const Button = styled.div`
  margin: 10px;
  opacity: ${props => props.onTransition && '0.1'};
  color: ${props => props.isPlaying ? 'yellow' : 'darkslategrey'};
  font-weight: ${props => props.isPlaying && 'bold'};
  transform: ${props => props.isPlaying && 'translateX(-3px) scale(1.5)'};
  transition: all 0.3s;
`
const SpinContainer = styled(Container)`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  ${props => props.autoRotate && spinStyle};
  animation-play-state: ${props => props.animationPaused ? 'paused':'running'};
  /* margin-bottom: 100px; */
`
const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
`
const Backface = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  /* background: black; */
  background-image: url(${backgroundImage});
  background-size: cover;
  opacity: 1;
  border-radius: 10px;
  backface-visibility: hidden;
  transform: rotateY( 180deg );
  /* -webkit-box-shadow: 0 0 8px #fff; */
  /* box-shadow: 0 0 8px #fff; */
  -webkit-box-reflect: below 10px
    linear-gradient(transparent, transparent, #0005);
`
const VideoTitle = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  background: white;
  color: black;
  opacity: 1;
  font-size: 30px;
  font-weight: 500;
  text-align: left;
  backface-visibility: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`
const LogContainer = styled.div`
  margin: auto;
`
const LogoText = styled.div`
  font-size: 100px;
  font-weight: bold;
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
  -webkit-box-shadow: 0 0 8px #fff;
  box-shadow: 0 0 8px #fff;
  -webkit-box-reflect: below 10px
    linear-gradient(transparent, transparent, #0005);
  &:hover {
    -webkit-box-shadow: 0 0 15px #fffd;
    box-shadow: 0 0 15px #fffd;
    -webkit-box-reflect: below 10px
      linear-gradient(transparent, transparent, #0007);
  }
`
const Ground = styled.div`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  position: absolute;
  top: 100%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%) rotateX(90deg);
  transform: translate(-50%, -50%) rotateX(90deg);
  background: -webkit-radial-gradient(
    center center,
    farthest-side,
    #9993,
    transparent
  );
`
const radius = 600; // how big of the radius
const autoRotate = true; // auto rotate or not
const rotateSpeed = 60; // unit: seconds/360 degrees
const imgWidth = 600; // width of images (unit: px)
const imgHeight = 350; // height of images (unit: px)
const CLASS_FOR_POINTER_EVENT_FREE = 'buttonClass';

const makePlayerFront = (element, degree) => {
  element.style.transform = `rotateX(0deg) rotateY(${degree * -1}deg)`
}
const removeTransition = element => {
  element.style.transition = 'none';
}

const AUTO_PLAY = true;
const USE_STATIC_TY = false;
const TY = 10;
// const ANIMATION_SECONDS = 0.6;
const ANIMATION_SECONDS = 1;
const NO_ROTATE_BETWEEN_AUTO_PLAY = true;

function Slide3D(props) {
  const {db, parentRef} = props;
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [animationPaused, setAnimationPaused] = React.useState(false);
  const [activeIdState, setActiveIdState] = React.useState(null);
  const [currentPlayingId, setCurrentPlayingId] = React.useState(null);
  const [onTransition, setOnTransition] = React.useState(false);
  const dragRef = React.useRef(null);
  const spinRef = React.useRef(null);
  const videoContaiersRef = React.useRef([])
  const videoTitleRef = React.useRef([]);
  const itemsRef = React.useRef([]);
  const buttonsRef = React.useRef([]);
  const timerRef = React.useRef();
  const startXY = React.useRef({x:0, y:0});
  const destXY = React.useRef({x:0, y:0});
  const targetXY = React.useRef({x:0, y:0});
  // console.log(startXY, destXY, targetXY)

  React.useEffect(() => {
    console.log('db.length=', db.length, videoContaiersRef.current);
    videoContaiersRef.current.forEach((videoContainerRef,i) => {
      if(videoContainerRef === null) return;
      videoContainerRef.style.transform = `rotateY(${i * (360/db.length)}deg) translateZ(${radius}px)`;
      videoContainerRef.style.transition = `transform ${ANIMATION_SECONDS}s`;
      videoContainerRef.style.transitionDelay = `${(db.length - i)/4}s`
    })
    itemsRef.current.forEach((itemRef, i) => {
      itemRef.addEventListener('play', () => {
        setCurrentPlayingId(i)
      })
      itemRef.addEventListener('pause', () => {
        setCurrentPlayingId(null)
      })
      itemRef.addEventListener('end', () => {
        setCurrentPlayingId(null)
      })
    })
  }, [db.length, itemsRef])

  console.log('current playing Id = ', currentPlayingId)

  const stopPlayerById = React.useCallback((playerId) => {
    const player = itemsRef.current[playerId];
    const videoContainer = videoContaiersRef.current[playerId]
    videoContainer.style.transform = videoContainer.style.transform.replace(/scale(.*)/, '');
    player?.pause();
  }, [])

  const restorePlayer = React.useCallback((event) => {
    const container = dragRef.current;
    setActiveIdState(null);
    const ty = USE_STATIC_TY ? TY : targetXY.current.y;
    const tx = (event.target.id * (360/db.length) * -1);
    container.style.transform = `rotateX(${-ty}deg) rotateY(${tx}deg)`;
    const currentPlayer = event.target;
    const videoContainer = videoContaiersRef.current[event.target.id]
    videoContainer.style.transform = videoContainer.style.transform.replace(/scale(.*)/, '');
    if(!NO_ROTATE_BETWEEN_AUTO_PLAY){
      setTimeout(() => {
        setAnimationPaused(false)
        setAutoRotate(true)
        removeTransition(container);
      }, ANIMATION_SECONDS * 110)
    }
    currentPlayer.currentTime = 0;
    currentPlayer.removeEventListener('ended', restorePlayer);
    if(AUTO_PLAY){
      const currentId = currentPlayer.id;
      if(currentId < db.length - 1){
        const nextId = parseInt(currentId) + 1;
        console.log(currentId, nextId, itemsRef.current)
        setTimeout(() => {
          buttonsRef.current[nextId].click();
        }, 700)
      }
    }
  }, [db.length])

  const playerHandler = React.useCallback((id) => {
    return () => {
      try {
        const currentPlayer = itemsRef.current[id];
        const videoContainer = videoContaiersRef.current[id];
        const isPaused = currentPlayer?.paused;
        if(isPaused){
          // console.log('playerHandler:', isPaused, id)
          if(currentPlayingId !== null){
            // other player is running
            console.log('other player is now playing. stop first!');
            stopPlayerById(currentPlayingId);
          }
          currentPlayer.addEventListener('ended', restorePlayer, {once: true})
          videoContainer.style.transition = `${ANIMATION_SECONDS}s`;
          videoContainer.style.transform += 'scale(2.0)';
          setAnimationPaused(true)
          void spinRef.current.offsetWidth;
          setAutoRotate(false)
          currentPlayer?.play();
          setCurrentPlayingId(id);
        } else {
          stopPlayerById(id);
          setAnimationPaused(false)
          setAutoRotate(true)
        }
        setOnTransition(false);
      } catch(err) {
        console.log(err)
      }
    }
  }, [currentPlayingId, restorePlayer, stopPlayerById])

  const onClickButton = React.useCallback((event) => {
    if(onTransition){
      return;
    }
    const clickedPlayerId = event.target.id;
    const container = dragRef.current;
    const currentPlayer = itemsRef.current[clickedPlayerId];
    const videoContainer = videoContaiersRef.current[clickedPlayerId]
    const isPaused = currentPlayer?.paused;
    setOnTransition(true);

    const transitionEndHandler = (e) => {
      setActiveIdState(clickedPlayerId);
      const isTransitionFromVideo = e.target.tagName === 'VIDEO' || e.target.getAttribute('type') === 'videoContainer';
      console.log('transitionEnd:', e.target.tagName, e.target.getAttribute('type'))
      if(!isTransitionFromVideo){
        playerHandler(clickedPlayerId)()
        setAutoRotate(false)
        console.log('remove transitionend in transitionHandler')
        container.removeEventListener('transitionend', transitionEndHandler)
      }
      removeTransition(container);
    }

    if(activeIdState === clickedPlayerId && !isPaused){
      console.log('### clicked Same player under playing:', activeIdState, clickedPlayerId)
      setActiveIdState(null);
      const ty = USE_STATIC_TY ? TY : targetXY.current.y;
      const tx = (clickedPlayerId * (360/db.length) * -1) - 5;
      container.style.transform = `rotateX(${-ty}deg) rotateY(${tx}deg)`;
      videoContainer.style.transform = videoContainer.style.transform.replace(/scale(.*)/, '');
      currentPlayer?.pause();
      setAnimationPaused(false)
      setAutoRotate(true)
      removeTransition(container);
      setOnTransition(false);
      console.log('remove transitionend in same player under playing')
      container.removeEventListener('transitionend', transitionEndHandler)
      return;
    }
    if(activeIdState === clickedPlayerId && isPaused){
      console.log('### clicked Same player which inactive:', activeIdState, clickedPlayerId)
      console.log('add transitionend in same player with inactive')
      container.addEventListener('transitionend', transitionEndHandler);
      const tx = clickedPlayerId * (360/db.length) * -1;
      const ty = USE_STATIC_TY ? TY : targetXY.current.y;
      container.style.transform = `rotateX(${-ty}deg) rotateY(${tx}deg)`;
      targetXY.current.y = ty;
      targetXY.current.x = tx;
      return;
    }
    console.log('### clicked new player:', activeIdState, clickedPlayerId)
    setAutoRotate(false)
    console.log('add transitionend in new Player')
    container.addEventListener('transitionend', transitionEndHandler);
    container.style.transition = `transform ${ANIMATION_SECONDS}s`;
    const ty = USE_STATIC_TY ? TY : targetXY.current.y;
    const tx = clickedPlayerId * (360/db.length) * -1;
    container.style.transform = `rotateX(${-ty}deg) rotateY(${tx}deg)`;
    targetXY.current.y = ty;
    targetXY.current.x = tx;
    return ()  => {
      console.log('remove transitionend in return')
      container.removeEventListener('transitionend', transitionEndHandler)
    }
  }, [activeIdState, db.length, onTransition, playerHandler])

  const toggleAutoRotate = React.useCallback(() => {
    setAutoRotate(autoRotate => {
      return !autoRotate
    })
  }, [])
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

  React.useEffect(() => {
    parentRef.current.onpointerdown = (e) => {
      clearInterval(timerRef.current);
      e = e || window.event; 
      startXY.current.x = e.clientX;
      startXY.current.y = e.clientY;
      parentRef.current.onpointermove = (e) => {
        const moveElement = document.elementFromPoint(e.clientX, e.clientY);
        const ignoreEvent = moveElement.classList.contains(CLASS_FOR_POINTER_EVENT_FREE);
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
        const upElement = document.elementFromPoint(e.clientX, e.clientY);
        const ignoreEvent = upElement.classList.contains(CLASS_FOR_POINTER_EVENT_FREE);
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

  return (
    <TopContainer>
      <Container
        ref={dragRef}
      > 
        <SpinContainer 
          ref={spinRef}
          autoRotate={autoRotate}
          animationPaused={animationPaused}
          width={imgWidth} 
          height={imgHeight}
        >
          {db.map((item, i) => (
            <VideoContainer
              key={item.id}
              ref={el => videoContaiersRef.current[i] = el}
              type="videoContainer"
            >
              <Item
                id={i}
                className={CLASS_FOR_POINTER_EVENT_FREE}
                // onClick={playerHandler(i)}
                onClick={onClickButton}
                src={item.src}
                ref={el => itemsRef.current[i] = el}
                itemIndex={i}
                itemLength={db.length}
                radius={radius}
              >
              </Item>
              <VideoTitle
                ref={el => videoTitleRef.current[i] = el}
              >
                {item.title}
              </VideoTitle>
              <Backface>
                {/* <LogContainer>
                  <LogoText>SBS</LogoText>
                </LogContainer> */}
              </Backface>
            </VideoContainer>
          ))}
        </SpinContainer>
        <Ground width={radius*3} height={radius*3}></Ground>
      </Container>
      <ControlContainer>
        <Buttons>
          <Button onClick={toggleAutoRotate}>{autoRotate ? "Stop Rotate" : "Start Rotate"}</Button>
          {db.map((item, i) => (
            <Button 
              key={item.id} 
              id={i} 
              className={CLASS_FOR_POINTER_EVENT_FREE} 
              ref={el => buttonsRef.current[i] = el}
              onClick={onClickButton}
              onTransition={onTransition}
              isPlaying={currentPlayingId === i}
            >
              {item.title}
            </Button>
          ))}
          <Button onClick={toggleAnimationPaused}>{animationPaused ? "Resume Rotate" : "Pause Rotate"}</Button>
          <Button>{onTransition ? 'T':'F'}</Button>
        </Buttons>
      </ControlContainer>
    </TopContainer>
  )
}

export default Slide3D;
