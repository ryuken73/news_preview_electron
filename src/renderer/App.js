import './App.css';
import React from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import Slide3D from './Components/Slide3D';
import TinderCards from './Components/TinderCards';

const Container = styled.div`
  background-color: #111;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  font-size: calc(11px + 2vmin);
  overflow: hidden;
  color: white;
  perspective: 4000px;
`;
const DEFAULT_DB = [
  // {id: 9, title: '한파', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'},
  // {id: 8, title: '겨울', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'},
  // {id: 7, title: '원석진', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'},
  // {id: 6, title: '무장', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'},
  // {id: 4, title: 'AA', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'},
  // {id: 5, title: 'BB', src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
  { id: 7, title: '원석진', src: 'd:/temp/4.mp4' },
  { id: 6, title: '무장', src: 'd:/temp/5.mp4' },
  { id: 9, title: '한파', src: 'd:/temp/2.mp4' },
  { id: 8, title: '겨울', src: 'd:/temp/3.mp4' },
  { id: 4, title: 'AA', src: 'd:/temp/6.mp4' },
  { id: 5, title: 'BB', src: 'd:/temp/7.mp4' },
];

const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prd';
const ASSET_INFO_URL =
  mode === 'dev' ? 'http://localhost' : 'http://10.10.104.246';
const URL_MAPS = {
  byAssetId: `${ASSET_INFO_URL}/asset`,
  latestNewsPreview: `${ASSET_INFO_URL}/asset/latestNewsPreview`,
  newsPreviewList: `${ASSET_INFO_URL}/assetList/newsPreview`,
};
const getAssetFromServer = async (options) => {
  const { cmd, param = null } = options;
  const baseUrl = URL_MAPS[cmd];
  const url = param === null ? baseUrl : `${baseUrl}/${param}`;
  return fetch(url)
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      if (cmd === 'newsPreviewList') {
        const { assetList = [] } = data;
        return assetList;
      }
      const { assetId, sources } = data;
      const sourcesForDB = sources.map((source) => {
        return {
          id: source.srcId,
          title: source.srcTitle,
          src: source.srcRemote,
        };
      });
      return { assetId, sources: sourcesForDB };
    })
    .catch((err) => {
      console.error(err)
      if (cmd === 'newsPreviewList'){
        return null;
      }
      return { assetId: null, sources: [] };
    })
};

function App() {
  const [mode, setMode] = React.useState('slide');
  const containerRef = React.useRef();
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get('assetId') || null;
  const [db, setDB] = React.useState(DEFAULT_DB);
  const [currentAssetId, setCurrentAssetId] = React.useState(null);
  const [newsPreviewList, setNewsPreviewList] = React.useState([]);
  console.log(assetId);
  console.log('####', currentAssetId, newsPreviewList)

  const setDBFromServer = React.useCallback(async (cmd, param) => {
    const { assetId, sources } = await getAssetFromServer({
      cmd,
      param
    });
    if (sources.length > 0) {
      setDB(sources);
    }
    setCurrentAssetId(assetId);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(async () => {
    // const {assetId, sources} = await getAssetFromServer({
    //   cmd: 'latestNewsPreview',
    // });
    // setDB(sources);
    // setCurrentAssetId(assetId);
    await setDBFromServer('latestNewsPreview');
    const assetList = await getAssetFromServer({
      cmd: 'newsPreviewList'
    })
    if(assetList !== null){
      setNewsPreviewList(assetList);
    }
  }, []);

  return (
    <div className="App">
      <Container ref={containerRef}>
        {mode === 'tinder' && <TinderCards db={db} />}
        {mode === 'slide' && (
          <Slide3D
            db={db}
            parentRef={containerRef}
            currentAssetId={currentAssetId}
            newsPreviewList={newsPreviewList}
            setDBFromServer={setDBFromServer}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
