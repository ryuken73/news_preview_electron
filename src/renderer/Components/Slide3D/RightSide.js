import React from 'react';
import styled from 'styled-components';
import SetRotationSpeed from './Config/SetRotationSpeed';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

const ControlContainer = styled.div`
  display: flex;
  width: ${props => `${props.width}px`};
  z-index: 10;
`
const Buttons = styled.div`
  display: ${props => !props.show && 'none'};
  min-width: 100px;
  margin: auto;
  z-index: 9999;
  position: relative;
`
const Button = styled.div`
  padding: 10px;
  opacity: ${props => props.onTransition && '0.1'};
  color: ${props => props.isPlaying ? 'yellow' : props.isNextItem ? '#272543' : 'darkslategrey'};
  font-size: ${props => `${props.fontSize}px`};
  font-weight: ${props => props.isPlaying ? 200 : 200};
  transition: all 0.3s;
  word-break: keep-all;
`
const StandbyButton = styled(Button)`
  visibility: ${props => props.disabled && 'hidden'};
  opacity: ${props => props.disabled ? '0':'0.5'};
  font-size: 20px;
  margin-top: 20px;
`
const CustomRefreshIcon = styled(RefreshIcon)`
  position: absolute;
  bottom: -100px;
  right: 100px;
  margin: 10px;
  z-index: 9999;
  opacity: 0.1;
`
const CustomSettingIcon = styled(SettingsIcon)`
  position: absolute;
  bottom: -100px;
  right: 30px;
  margin: 10px;
  z-index: 9999;
  opacity: 0.1;
`
const CustomPlayIcon = styled(PlayCircleFilledIcon)`
  display: ${props => !props.show && 'none !important'};
  position: absolute;
  bottom: 40%;
  right: 10px;
  margin: 5px;
  z-index: 9999;
  opacity: 0.2;
`
const CustomPauseIcon = styled(PauseCircleFilledIcon)`
  display: ${props => !props.show && 'none !important'};
  position: absolute;
  bottom: 40%;
  right: 10px;
  margin: 5px;
  z-index: 9999;
  opacity: 0.2;
`
const CLASS_FOR_POINTER_EVENT_FREE = 'buttonClass';

const RightSide = (props) => {
  const {
    db,
    config,
    mirrorErr,
    updateConfig,
    buttonsRef,
    onClickButton,
    underTransition,
    currentPlayingId,
    activeIdState,
    toggleDialogOpen,
    unFoldPlayer,
    setStandby,
    mirrorPlayer,
    startPlayFromFirst,
    stopPlayerCurrent
  } = props;
  const standbyBtnDisabled = activeIdState !== null;
  console.log('standby disabled:', standbyBtnDisabled, activeIdState)
  const reloadPage = React.useCallback(() => {
    window.location.reload();
  }, [])
  return (
    <ControlContainer
      className={CLASS_FOR_POINTER_EVENT_FREE}
      width={config.buttonWidth}
    >
        <Buttons
          className={CLASS_FOR_POINTER_EVENT_FREE}
          show={config.useTitleBar}
        >
          <SetRotationSpeed
            className={CLASS_FOR_POINTER_EVENT_FREE} 
            updateConfig={updateConfig}
            config={config}
          ></SetRotationSpeed>
          {db.map((item, i) => (
            <Button 
              key={item.id} 
              id={i} 
              className={CLASS_FOR_POINTER_EVENT_FREE} 
              fontSize={config.buttonFontSize}
              ref={el => buttonsRef.current[i] = el}
              onClick={onClickButton}
              onTransition={underTransition}
              isPlaying={currentPlayingId == i}
              isNextItem={parseInt(activeIdState)+1 == i}
            >
              {item.title}
            </Button>
          ))}
          <CustomRefreshIcon
            fontSize='large'
            className={CLASS_FOR_POINTER_EVENT_FREE}
            onClick={reloadPage}
          ></CustomRefreshIcon>
          <CustomSettingIcon
            fontSize='large'
            className={CLASS_FOR_POINTER_EVENT_FREE}
            onClick={toggleDialogOpen}
          ></CustomSettingIcon>
          {config.startWithStacked ? (
            <Button 
              style={{
                color: 'grey', 
                opacity:0.2, 
                fontSize: '20px',
              }}
              onClick={unFoldPlayer}
              disabled={activeIdState !== null}
            >Standby</Button>
          ):(
            <StandbyButton 
              className={CLASS_FOR_POINTER_EVENT_FREE} 
              onClick={setStandby}
              disabled={standbyBtnDisabled}
            >Standby</StandbyButton>
          )}
          {mirrorErr && (
            <Button 
              className={CLASS_FOR_POINTER_EVENT_FREE}
              style={{color: 'red', opacity:1, fontSize: '15px'}}
              onClick={mirrorPlayer}
            >
              Turn On Reflect All
            </Button>
          )}
        </Buttons>
        {currentPlayingId === null ? (
          <CustomPlayIcon
            fontSize="large"
            onClick={startPlayFromFirst}
            show={!config.useTitleBar}
            className={CLASS_FOR_POINTER_EVENT_FREE}
          ></CustomPlayIcon>
          ):( 
          <CustomPauseIcon
            fontSize="large"
            show={!config.useTitleBar}
            onClick={stopPlayerCurrent}
            className={CLASS_FOR_POINTER_EVENT_FREE}
          ></CustomPauseIcon>
        )}
    </ControlContainer>
  )
}

export default React.memo(RightSide);