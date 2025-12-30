import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter, Route, Routes } from 'react-router';
import { MusicPage } from './pages/Music';
import { NavigationPage } from './pages/Navigation';
import { DefaultTheme } from './types/theme';

function App() {

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
      <Wrapper>
        {
          !!msg && isHidden && <AIMsg>{msg}</AIMsg>
        }
        <ContentWrapper isHidden={isHidden}>
        <BrowserRouter>
          <Content>
            <Routes>
              <Route path='/' Component={MusicPage} />
              <Route path='/navigation' Component={NavigationPage} />
            </Routes>
          </Content>
          <SidebarWrapper>
            <Sidebar />
          </SidebarWrapper>
        </BrowserRouter>
        </ContentWrapper>
      </Wrapper>
    </ThemeProvider>
  );
}

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

const ContentWrapper = styled.div<{isHidden: boolean}>`
  width: 100%;
  height: 100%;
  ${({ isHidden }) => isHidden ? `
  transform: translateY(200px) rotateX(5deg);
  filter: blur(5px);
  pointer-events: none;
  ` : ""}
  transition: transform 1s, filter 1s;
  transform-origin: top center;
`;

const SidebarWrapper = styled.div`
  height: 100%;
  width: fit-content;
  position: absolute;
  top: 0;
  left: 12px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export default App;
