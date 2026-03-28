import { Fragment, useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { NavigationPage } from './pages/Navigation/Navigation';
import { DefaultTheme } from './types/theme';
import { Youtube } from './pages/Youtube';
import "react-simple-keyboard/build/css/index.css";
import { Dashboard } from './pages/Dashboard/Dashboard';
import { OverviewPage } from './pages/Overview/Page';
import { PlayerService } from './services/player.service';
import { Notification } from './components/Notification';
import { MusicPage } from './pages/Music/Page';
import { StatsPage } from './pages/Stats/Page';

function App() {

  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    // ref.current.requestFullscreen();
  }, [ref.current]);
  const [isHidden, setIsHidden] = useState(false);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const gpsStream = new WebSocket("ws://192.168.2.46:8066/ws");

    gpsStream.addEventListener("message", (msg) => {
      console.log(msg.data);
      switch (msg.data) {
        case "start":
          setIsHidden(true);
          setMsg("");
          break;
        case "stop":
          setIsHidden(false);
          break;
        default:
          setMsg(msg.data);
          break;
      }
    });

    return () => gpsStream.close()
  }, [setIsHidden, setMsg]);

  return (
    <ThemeProvider theme={DefaultTheme}>
      <PlayerService>
      <Notification>
        <Wrapper ref={ref}>
          <BrowserRouter>
            <Routes>
              <Route path='/dashboard' Component={Dashboard} />
              <Route path='/media' Component={Media}>
                <Route path='overview' Component={OverviewPage} />
                <Route path='music' Component={MusicPage} />
                <Route path='navigation' Component={NavigationPage} />
                <Route path='youtube' Component={Youtube} />
                <Route path='stats' Component={StatsPage} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Wrapper>
      </Notification>
      </PlayerService>
    </ThemeProvider>
  );
}

const Media = () => {
  return <ContentWrapper isHidden={false}>
    <SidebarWrapper>
      <Sidebar />
    </SidebarWrapper>
    <Content>
      <Outlet />
    </Content>
  </ContentWrapper>
};

const AIMsg = styled.div`
  position: absolute;
  top: 0px;
  left: 300px;
  color: white;
  font-size: 30px;
`;

const Wrapper = styled.div`
  width: 1920px;
  height: 720px;
  perspective: 720px;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div<{ isHidden: boolean }>`
  width: 100%;
  height: 100%;
  ${({ isHidden }) => isHidden ? `
  transform: translateY(200px) rotateX(5deg);
  filter: blur(5px);
  pointer-events: none;
  ` : ""}
  transition: transform 1s, filter 1s;
  transform-origin: top center;
  padding: 20px;
  display: grid;
  grid-template-columns: auto 1fr;
  position: relative;
  gap: 20px;
`;

const SidebarWrapper = styled.div`
  height: 100%;
  width: fit-content;
  top: 0;
  z-index: 1;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export default App;
