/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import audioTouch from '../../assets/audio/touch.mp3';
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
  margin: 10px;
  border-radius: 20px;
`;
const Item = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
`;
const TitleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 15vh;
  width: 100%;
  border-radius: 20px;
`;
const Title = styled.div`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 15vh;
  font-size: ${(props) => `${props.fontSize}px` || '50px'};
  line-height: 15vh;
  vertical-align: middle;
  background: rgba(0, 0, 0, 0.5);
`;
const AutoPlayContainer = styled.div`
  position: absolute;
  top: 0;
  right: -5vw;
  width: 5vw;
  height: 15vh;
  font-size: 20px;
  line-height: 15vh;
  opacity: 0;
`;

const INITIAL_CONFIG = defaultConfig;

function Video(props, ref) {
  const {
    item,
    id,
    activeIdState,
    setActiveIdState,
    config,
    parentRef,
    lastOrderRef,
    videoContainersRef,
    inTransitionRef,
  } = props;
  const [zIndex, setZindex] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [isAutoPlay, setAutoPlay] = React.useState(false);

  // const videoContainerRef = React.useRef(null);
  const itemRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const flipStateRef = React.useRef(null);
  const autoPlayRef = React.useRef(null);

  const LOCAL_MEDIA_PATH = config.mediaRootGrid;
  const USE_LOCAL_PATH = config.useLocalPathGrid || false;
  const TITLE_FONT_SIZE = config.titleFontSizeGrid || 50;
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

  const isActive = id === parseInt(activeIdState, 10);

  const { contextSafe } = useGSAP();

  const WIDTH_DURATION = 0.2;
  const HEIGHT_DURATION = 0.3;
  const SCATTER_OUT_DURATION = 0.5;
  const SCATTER_IN_DURATION = 0.5;

  console.log('playerId', id);
  console.log('activeIdState', activeIdState);
  console.log('isAutoPlay', isAutoPlay);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const startExpand = contextSafe((isAutoPlay) => {
    console.log(isAutoPlay)
    setActiveIdState(id);
    inTransitionRef.current = true;
    const videoElement = videoContainersRef.current[id];
    const gsapMoveDown = () => {
      const state = Flip.getState([parentRef.current, videoElement]);
      flipStateRef.current = state;
      parentRef.current.style.display = 'flex';
      parentRef.current.style.flexDirection = 'column';
      parentRef.current.style.justifyContent = 'end';
      parentRef.current.style.height = '100vh';
      lastOrderRef.current += 1;
      videoElement.style.order = lastOrderRef.current;
      // videoElement.style.margin = 0;
      const tl = Flip.from(state, {
        duration: 0.5,
        nested: true,
      });
      return tl;
    };
    const gsapHozExpand = gsap.to(videoElement, {
      width: '100vw',
      duration: WIDTH_DURATION,
      onComplete: () => {
        new Audio(audioScaleUp).play();
      },
    });

    const gsapVertExpand = gsap.to(videoElement, {
      height: '100vh',
      duration: HEIGHT_DURATION,
      borderRadius: 0,
      margin: 0,
      onComplete: () => {
        setExpanded(true);
        inTransitionRef.current = false;
        if (isAutoPlay) {
          console.log('in gsapVertExpand');
          itemRef.current.play();
        }
      },
    });

    const gsapScaleUpTitle = gsap.to(titleRef.current, {
      duration: HEIGHT_DURATION,
      fontSize: TITLE_FONT_SIZE * 1.5,
      borderRadius: 0,
    });

    const gsapVideoRect = gsap.to(itemRef.current, {
      duration: HEIGHT_DURATION,
      borderRadius: 0,
    });

    const gsapScatterAway = () => {
      const randomMinus = gsap.utils.random(-100, -50, 1, true);
      const randomPlus = gsap.utils.random(50, 100, 1, true);
      const otherElements = videoContainersRef.current.filter(
        (videoContainer) => {
          return parseInt(videoContainer.id, 10) !== id;
        },
      );
      const tween = gsap.to(otherElements, {
        x: () => `${gsap.utils.random([randomMinus(), randomPlus()])}vw`, // 요소마다 새 랜덤 값
        y: () => `${gsap.utils.random([randomMinus(), randomPlus()])}vh`,
        rotate: () =>
          `${gsap.utils.random([randomMinus(), randomPlus()]) * 10}`,
        opacity: 0,
        duration: SCATTER_OUT_DURATION,
        width: 50,
      });
      return tween;
    };

    const master = gsap.timeline();

    master
      .add(gsapMoveDown())
      .add(gsapScatterAway(), '<')
      .add('expandStart')
      .add(gsapHozExpand, 'expandStart')
      .add(gsapVideoRect, 'expandStart')
      .add(gsapScaleUpTitle, 'expandStart')
      .add(gsapVertExpand, '>');
  });

  const startShrink = contextSafe(() => {
    inTransitionRef.current = true;
    const videoElement = videoContainersRef.current[id];
    const gsapMoveUp = () => {
      const state = Flip.getState([parentRef.current, videoElement]);
      parentRef.current.style.display = 'null';
      parentRef.current.style.flexDirection = 'null';
      parentRef.current.style.justifyContent = 'null';
      parentRef.current.style.height = 'auto';
      videoElement.style.order = id;
      // videoElement.style.margin = '10px';
      const tl = Flip.from(state, {
        duration: 0.5,
        nested: true,
      });
      return tl;
    };
    const gsapVertShrink = gsap.to(videoElement, {
      height: '15vh',
      duration: HEIGHT_DURATION,
      borderRadius: 20,
      margin: 10,
    });
    const gsapTitleShrink = gsap.to(titleRef.current, {
      duration: HEIGHT_DURATION,
      fontSize: TITLE_FONT_SIZE,
      borderRadius: 20,
    });
    const gsapBorderReset = gsap.to(itemRef.current, {
      duration: HEIGHT_DURATION,
      borderRadius: 20,
    });
    const gsapHozShrink = gsap.to(videoElement, {
      width: '50vw',
      duration: WIDTH_DURATION,
      onComplete: () => {
        itemRef.current.pause();
        new Audio(audioScaleDown).play();
        gsapMoveUp();
      },
    });
    const gsapScatterIn = () => {
      const randomMinus = gsap.utils.random(-100, -50, 1, true);
      const randomPlus = gsap.utils.random(50, 100, 1, true);
      const otherElements = videoContainersRef.current.filter(
        (videoContainer) => {
          return parseInt(videoContainer.id, 10) !== id;
        },
      );
      const tween = gsap.fromTo(
        otherElements,
        {
          x: () => `${gsap.utils.random([randomMinus(), randomPlus()])}vw`, // 요소마다 새 랜덤 값
          y: () => `${gsap.utils.random([randomMinus(), randomPlus()])}vh`,
          rotate: () =>
            `${gsap.utils.random([randomMinus(), randomPlus()]) * 10}`,
          opacity: 0,
          width: 0,
        },
        {
          x: 0,
          y: 0,
          rotate: 360,
          opacity: 1,
          width: '50vw',
          duration: SCATTER_IN_DURATION,
          stagger: 0.1,
          onComplete: () => {
            setActiveIdState(null);
            setExpanded(false);
            inTransitionRef.current = false;
          },
        },
      );
      return tween;
    };

    const master = gsap.timeline();

    master
      .add(gsapVertShrink)
      .add('shrinkStart')
      .add(gsapHozShrink, 'shrinkStart')
      .add(gsapTitleShrink, 'shrinkStart')
      .add(gsapBorderReset, 'shrinkStart')
      .add('moveStart')
      .add(gsapScatterIn(), 'moveStart');
  });

  const onClickTitle = React.useCallback(
    (e) => {
      e.stopPropagation();
      // if (timelineRef.current?.isActive()) {
      if (inTransitionRef.current === true) {
        return;
      }
      new Audio(audioTouch).play();
      if (expanded) {
        startShrink();
        return;
      }
      startExpand(isAutoPlay);
    },
    [expanded, isAutoPlay],
  );

  const onClickVideo = React.useCallback(() => {
    if (itemRef.current.paused) {
      itemRef.current.play();
    } else {
      itemRef.current.pause();
    }
  }, []);

  const blinkAutoPlayElement = contextSafe(() => {
    gsap.fromTo(
      autoPlayRef.current,
      {
        opacity: 1,
      },
      {
        opacity: 0,
        duration: 1,
      },
    );
  });

  const toggleAuto = React.useCallback((e) => {
    e.stopPropagation();
    blinkAutoPlayElement();
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setAutoPlay((isAutoPlay) => !isAutoPlay);
  }, []);

  return (
    <VideoContainer
      id={id}
      ref={ref}
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
          ref={titleRef}
          onClick={onClickTitle}
          fontSize={TITLE_FONT_SIZE}
          bgColor={TITLE_BAR_COLOR}
        >
          {item.title !== undefined && item.title.length !== 0
            ? item.title
            : 'H'}
        </Title>
      </TitleContainer>
      <AutoPlayContainer ref={autoPlayRef} onClick={toggleAuto}>
        {isAutoPlay ? 'auto' : 'manual'}
      </AutoPlayContainer>
    </VideoContainer>
  );
}

export default React.memo(React.forwardRef(Video));
