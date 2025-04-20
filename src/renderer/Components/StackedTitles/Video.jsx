/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import audioScaleUp from '../../assets/audio/scaleUp.mp3';
import audioScaleDown from '../../assets/audio/scaleDown.mp3';
import useLocalStorage from '../../hooks/useLocalStorage';
import defaultConfig from '../GridCards/Config/defaultConfig';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(Flip);

const VideoContainer = styled.div`
  position: relative;
  height: 15vh;
  width: 50vw;
  order: ${(props) => props.id};
`;
const Item = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const TitleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 15vh;
  width: 100%;
`;
const Title = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  font-size: ${(props) => `${props.fontSize * 2}px` || '50px'};
  line-height: 15vh;
  vertical-align: middle;
  height: 15vh;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
`;

const INITIAL_CONFIG = defaultConfig;

export default React.memo(function Video(props) {
  const {
    item,
    id,
    activeIdState,
    setActiveIdState,
    config,
    parentRef,
    lastOrderRef,
    animationPhase,
    setAnimationPhase,
  } = props;
  const [zIndex, setZindex] = React.useState(0);

  const topRef = React.useRef(null);
  const videoContainerRef = React.useRef(null);
  const itemRef = React.useRef(null);

  const LOCAL_MEDIA_PATH = config.mediaRootGrid;
  const USE_LOCAL_PATH = config.useLocalPathGrid || false;
  const TITLE_FONT_SIZE = config.titleFontSizeGrid || 50;
  const TITLE_FONT_FAMILY = config.titleFontFamilyGrid || 'SUITE';
  const TITLE_BAR_COLOR = config.titleBarColorGrid || 'rgba(0, 0, 0, 0.4)';
  const VIDEO_FILTER_TYPE = config.videoFilterTypeGrid || 'saturate';
  const VIDEO_FILTER_VALUE =
    config.videoFilterValueGrid == undefined ? 20 : config.videoFilterValueGrid;
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

  console.log('xx', id, activeIdState);
  const isActive = id === parseInt(activeIdState, 10);
  const isExpandPhase = animationPhase === null;
  const isShrinkPhase = animationPhase === 'expand';

  useGSAP(
    () => {
      console.log('isActive Changed:', id, activeIdState, isActive);
      if (animationPhase === null) {
        return;
      }
      if (isActive) {
        return;
      }
      const xRand = `${Math.random() * 200 - 100}vw`;
      const yRand = `${Math.random() * 200 - 100}vh`;
      const rRand = `${Math.random() * 1800}`;
      if (animationPhase === 'shrink') {
        gsap.fromTo(
          videoContainerRef.current,
          {
            x: xRand,
            y: yRand,
            rotate: rRand,
            opacity: 0,
            width: 0,
          },
          {
            x: 0,
            y: 0,
            rotate: 360,
            opacity: 1,
            width: '50vw',
            duration: 0.5,
            onComplete: () => {
              setAnimationPhase(null);
              setActiveIdState(null);
            },
          },
        );
        return;
      }
      if (animationPhase === 'expand') {
        gsap.to(videoContainerRef.current, {
          x: xRand,
          y: yRand,
          rotate: rRand,
          opacity: 0,
          duration: 0.5,
          width: 50,
        });
      }
    },
    {
      scope: topRef.current,
      dependencies: [activeIdState, animationPhase],
    },
  );

  const { contextSafe } = useGSAP({ scope: topRef.current });

  const gsapMoveDown = contextSafe(() => {
    const state = Flip.getState([parentRef.current, videoContainerRef.current]);
    parentRef.current.style.display = 'flex';
    parentRef.current.style.flexDirection = 'column';
    parentRef.current.style.justifyContent = 'end';
    parentRef.current.style.height = '100vh';
    lastOrderRef.current += 1;
    videoContainerRef.current.style.order = lastOrderRef.current;
    const tl = Flip.from(state, {
      duration: 0.5,
      nested: true,
    });
    return tl;
  });
  const gsapMoveUp = contextSafe(() => {
    const state = Flip.getState([parentRef.current, videoContainerRef.current]);
    parentRef.current.style.display = 'null';
    parentRef.current.style.flexDirection = 'null';
    parentRef.current.style.justifyContent = 'null';
    parentRef.current.style.height = 'auto';
    videoContainerRef.current.style.order = id;
    const tl = Flip.from(state, {
      duration: 0.5,
      nested: true,
    });
    return tl;
  });

  const gsapScaleUp = contextSafe((tl) => {
    setActiveIdState(id);
    tl.to(videoContainerRef.current, {
      width: '100vw',
      duration: 0.2,
    });
    tl.to(videoContainerRef.current, {
      height: '100vh',
      duration: 0.3,
    });
  });

  const gsapScaleDown = contextSafe(() => {
    const tl = gsap.timeline();
    tl.to(videoContainerRef.current, {
      height: '15vh',
      duration: 0.3,
    });
    tl.to(videoContainerRef.current, {
      width: '50vw',
      duration: 0.2,
      onComplete: () => {
        itemRef.current.pause();
        setAnimationPhase('shrink');
        gsapMoveUp();
      },
    });
  });

  const onClickTitle = React.useCallback(
    (e) => {
      e.stopPropagation();
      if (isExpandPhase) {
        const tl = gsapMoveDown();
        gsapScaleUp(tl);
        setAnimationPhase('expand');
      } else if (isShrinkPhase) {
        gsapScaleDown();
      }
    },
    [isExpandPhase, isShrinkPhase],
  );

  const onClickVideo = React.useCallback(() => {
    if (itemRef.current.paused) {
      itemRef.current.play();
    } else {
      itemRef.current.pause();
    }
  }, []);

  return (
    <VideoContainer
      id={id}
      ref={videoContainerRef}
      isActive={isActive}
      onClick={onClickVideo}
      zIndex={zIndex}
      videoFilter={{ type: VIDEO_FILTER_TYPE, value: VIDEO_FILTER_VALUE }}
      transitionDelay={VIDEO_TRANSITION_DELAY}
    >
      <Item
        crossOrigin="anonymous"
        id={id}
        src={USE_LOCAL_PATH ? toLocalPath(item.src) : item.src}
        ref={itemRef}
        itemIndex={id}
        radius={config.radius}
        isActive={isActive}
        muted
      />
      <TitleContainer
        show={item.title !== undefined && item.title.length !== 0}
      >
        <Title
          id={id}
          onClick={onClickTitle}
          fontSize={TITLE_FONT_SIZE}
          bgColor={TITLE_BAR_COLOR}
        >
          {item.title !== undefined && item.title.length !== 0
            ? item.title
            : 'H'}
        </Title>
      </TitleContainer>
    </VideoContainer>
  );
});
