import './App.css';
import React from 'react';
import Slide3D from './Components/Slide3D';
import TinderCards from './Components/TinderCards';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';

const Container = styled.div`
  background-color: #111;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  font-size: calc(11px + 2vmin);
  overflow: hidden;
  color: white;
  perspective: 4000px;
`
const ModeSelectBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
  color: white;
  opacity: 0.2;
`
const DEFAULT_DB = [
  {id: 9, title: '한파', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'},

  {id: 8, title: '겨울', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'},

  {id: 7, title: '원석진', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'},
  {id: 6, title: '무장', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'},

  {id: 4, title: 'AA', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'},

  // {id: 1, title: '진단 고지명', src: 'http://10.10.104.246/media/20240102/1704157250308_1692093041554_0815%20%EC%A1%B0%EB%8F%99%EC%B0%ACPT%2002_%EA%B9%80%ED%95%9C%EA%B8%B8.mp4'},
  // {id: 2, title: '대장암 초기 진단', src: 'http://10.10.104.246/media/20240102/1704157250307_1692093041552_0815%20%EC%A1%B0%EB%8F%99%EC%B0%ACPT%2001_%EA%B9%80%ED%95%9C%EA%B8%B8.mp4'},
  // {id: 3, title: '이재명 피습', src: 'http://10.10.104.246/media/20240102/1704157250308_1692093041555_0815%20%EC%A1%B0%EB%8F%99%EC%B0%ACPT%2003_%EA%B9%80%ED%95%9C%EA%B8%B8%20%EC%88%98%EC%A0%95.mp4'},

  {id: 5, title: 'BB', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
]

const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prd';
const ASSET_INFO_URL = mode === 'dev' ? 'http://localhost' : 'http://10.10.104.246';

function App() {
  const [mode, setMode] = React.useState('slide');
  const containerRef = React.useRef();
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get('assetId') || null;
  const [db, setDB ] = React.useState(DEFAULT_DB)
  console.log(assetId)

  React.useEffect(() => {
    if(assetId === null){
      return;
    }
    fetch(`${ASSET_INFO_URL}/asset/${assetId}`)
    .then(result => {
      return result.json()
    })
    .then(data => {
      const {sources} = data;
      const dbFromServer = sources.map(source => {
        return {
          id: source.srcId,
          title: source.srcTitle,
          src: source.srcRemote
        }
      })
      console.log(dbFromServer)
      setDB(dbFromServer)
    })
  }, [assetId])

  const onClickModeSelectBtn = React.useCallback(() => {
    setMode(mode => {
      return mode === 'tinder' ? 'slide' : 'tinder';
    })
  }, [])
  return (
    <div className="App">
      <Container ref={containerRef}>
        {mode === 'tinder' && (
          <TinderCards 
            db={db}
          >
          </TinderCards>
        )}
        {mode === 'slide' && (
          <Slide3D 
            db={db}
            parentRef={containerRef}
          >
          </Slide3D>
        )}

        {/* <ModeSelectBtn
          onClick={onClickModeSelectBtn}
        >
          Mode
        </ModeSelectBtn> */}
      </Container>
    </div>
  );
}

export default App;
