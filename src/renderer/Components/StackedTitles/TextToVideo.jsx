/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import ConfigDialog from '../GridCards/Config/ConfigDialog';
import useLocalStorage from '../../hooks/useLocalStorage';
import defaultConfig from '../GridCards/Config/defaultConfig';
import Video from './Video';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(Flip);

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  font-family: ${(props) => props.fontFamily};
  /* display: flex;
  flex-wrap: wrap; */
`;
const CenterContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const ConfigButton = styled.div`
  position: absolute;
  /* top: 50%;
  right: 50%; */
  bottom: -15vh;
  /* transform: translate(50%, -50%); */
  min-height: 15vh;
  line-height: 15vh;
  min-width: 100%;
  opacity: 0;
  /* opacity: 1; */
  /* background-color: maroon; */
`;

const INITIAL_CONFIG = defaultConfig;

export default React.memo(function TextToVideo(props) {
  const { db, setDBFromServer, newsPreviewList, currentAssetId } = props;
  const [storedValue, saveToLocalStorage] = useLocalStorage(
    'slide3D',
    INITIAL_CONFIG,
  );
  const [activeIdState, setActiveIdState] = React.useState(null);
  const [animationPhase, setAnimationPhase] = React.useState(null);
  const topRef = React.useRef(null);
  const videoParentContainer = React.useRef(null);
  const lastOrderRef = React.useRef(db.length);
  const videoContainersRef = React.useRef([]);
  const inTransitionRef = React.useRef(null);

  const configButtonRef = React.useRef(null);
  const buttonTweenRef = React.useRef(null);

  const [config, setConfig] = React.useState(storedValue);
  const [configDialogOpen, setConfigDialogOpen] = React.useState(false);

  const itemsRef = React.useRef([]);

  const TITLE_FONT_FAMILY = config.titleFontFamilyGrid || 'SUITE';
  const { contextSafe } = useGSAP();

  const updateConfig = React.useCallback(
    (key, value, saveLocal = true) => {
      setConfig((config) => {
        const newConfig = {
          ...config,
          [key]: value,
        };
        if (saveLocal) {
          saveToLocalStorage(newConfig);
        }
        return newConfig;
      });
    },
    [saveToLocalStorage],
  );

  const blinkButtonElement = contextSafe(() => {
    const tween = gsap.fromTo(
      configButtonRef.current,
      {
        opacity: 1,
      },
      {
        opacity: 0,
        duration: 2,
      },
    );
    return tween;
  });

  const toggleDialogOpen = React.useCallback((e) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const eventFromOpenButton = e !== undefined;
    if (eventFromOpenButton) {
      e?.stopPropagation();
      if (buttonTweenRef.current?.isActive()) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        setConfigDialogOpen((configDialogOpen) => !configDialogOpen);
      }
      buttonTweenRef.current = blinkButtonElement();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setConfigDialogOpen((configDialogOpen) => !configDialogOpen);
    }
  }, []);

  return (
    <Container ref={topRef} fontFamily={TITLE_FONT_FAMILY}>
      <CenterContainer ref={videoParentContainer}>
        {db.map((item, i) => (
          <Video
            id={i}
            item={item}
            activeIdState={activeIdState}
            setActiveIdState={setActiveIdState}
            config={config}
            itemsRef={itemsRef}
            parentRef={videoParentContainer}
            lastOrderRef={lastOrderRef}
            animationPhase={animationPhase}
            setAnimationPhase={setAnimationPhase}
            videoContainersRef={videoContainersRef}
            inTransitionRef={inTransitionRef}
            // eslint-disable-next-line no-return-assign
            ref={(el) => (videoContainersRef.current[i] = el)}
          />
        ))}
        <ConfigButton ref={configButtonRef} onClick={toggleDialogOpen}>
          click again to open config
        </ConfigButton>
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
      </CenterContainer>
    </Container>
  );
});
