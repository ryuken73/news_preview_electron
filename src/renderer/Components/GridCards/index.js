import React from 'react';
import styled from 'styled-components';
import backImage from '../../assets/images/background.jpg';
import defaultConfig from '../Slide3D/Config/defaultConfig';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 10px;
  padding: 10px;
  width: 100%;
  height: 100%;
  /* perspective: 4000px; */
  overflow: hidden;
  min-height: 100vh;
  background-image: url(${backImage});
  background-size: cover;
`;
const VideoContainer = styled.div`
  /* width: 100%;
  height: 100%; */
  /* position: absolute;
  left: 0;
  top: 0; */
  border-radius: 10px;
`;
const Item = styled.video`
  backface-visibility: hidden;
  /* position: absolute; */
  object-fit: cover;
  /* left: 0; */
  /* top: 0; */
  width: 100%;
  height: 100%;
  border-radius: 10px;
  line-height: 200px;
  font-size: 50px;
  text-align: center;
  box-sizing: border-box;
  outline: 2px rgba(255,255,255,0.6) solid;
`;
const INITIAL_CONFIG = defaultConfig;

function GridCards(props) {
  const {db} = props;
  const [activeIdState, setActiveIdState] = React.useState(null);
  const [config, setConfig] = React.useState(INITIAL_CONFIG);

  const videoContaiersRef = React.useRef([]);
  const itemsRef = React.useRef([]);

  const LOCAL_MEDIA_PATH = config.mediaRoot;
  const USE_LOCAL_PATH = config.useLocalPath || false;
  const REG_PATTERN = /http:\/\/.*\/(\d{8}\/.*\.mp4)/;
  const toLocalPath = React.useCallback((remoteSrc) => {
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
  return (
    <Container>
      {db.map((item, i) => (
        <VideoContainer
          key={item.id}
          ref={el => videoContaiersRef.current[i] = el}
          transitionType="scale"
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
           />
        </VideoContainer>

      ))}

    </Container>
  )
}

export default React.memo(GridCards);
