import { FC, useState } from "react";
import styled from "styled-components";
import { Papper } from "../../components/Papper";
import { Canvas, useFrame } from "@react-three/fiber";
import { Toggle } from "../../components/Toggle";

export const EngineeringPage: FC = () => {

    const [active, setActive] = useState<number>(0);

    return <Wrapper>
        <Canvas frameloop="demand">
            <Scene active={active} />
        </Canvas>
        <Papper>
            <Toggle onClick={() => setActive(a => (a + 1) % 5)}></Toggle>
        </Papper>
    </Wrapper>
};

const Scene: FC<{ active: number }> = ({ active }) => {
    useFrame((state) => { console.log("here"); state.camera.position.set(active * 0.5, 0, active * 0.5 + 2) });
    return <>
        {
            (new Array(5).fill(0)).map((_, i) =>
                <mesh position={[i * 0.5, 0, i * 0.5]}>
                    <boxGeometry />
                    <meshStandardMaterial color="rgb(0, 255, 0)" opacity={i === active ? 1 : 0.5} transparent />
                </mesh>
            )
        }
        <ambientLight intensity={0.4} />
        <directionalLight color="red" position={[0, 0, 5]} />
    </>
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(2, 1fr);

    & > * {
        overflow: hidden;
    }
`;