import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Papper } from "../../components/Papper";
import { useLazyWorkingTimeQuery, useWorkingTimeQuery } from "../../store/stats/statsApi";
import { LineChart } from "@mui/x-charts";
import styled, { useTheme } from "styled-components";
import { Label } from "../../components/Label";
import { createTheme, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const StatsPage: FC = () => {

    const { data } = useWorkingTimeQuery(`100 * avg by (instance) (1 - rate(node_cpu_seconds_total{mode="idle"}[10s]))`, { pollingInterval: 1000 });
    const { data: cpuTemp } = useWorkingTimeQuery(`node_hwmon_temp_celsius {chip="thermal_thermal_zone0", sensor="temp1"}`, { pollingInterval: 5000 });
    const { data: ramUsage } = useWorkingTimeQuery(`100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))`, { pollingInterval: 5000 });
    const { data: diskUsage } = useWorkingTimeQuery(`((node_filesystem_size_bytes{fstype!~"tmpfs|squashfs"} - node_filesystem_avail_bytes{fstype!~"tmpfs|squashfs"}) / node_filesystem_size_bytes{fstype!~"tmpfs|squashfs"}) * 100`, { pollingInterval: 5000 });
    const { data: free } = useWorkingTimeQuery(`(node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes`, { pollingInterval: 5000 });
    const theme = useTheme();

    return <Wrapper>
        <ChartContainer>
            {
                data && 
                <Chart
                    min={0}
                    max={100}
                    data={data.data.result[0].values.map((x: any) => x[1]) || [0]}
                />
            }
            <Label>% CPU</Label>
        </ChartContainer>
        <ChartContainer>
            {
                ramUsage && <Chart
                    min={0}
                    max={100}
                    data={ramUsage.data.result[0].values.map((x: any) => x[1])}
                />
            }
            <Label>% RAM</Label>
        </ChartContainer>
        <ChartContainer>
            {
                diskUsage && <Chart
                    min={0}
                    max={100}
                    data={diskUsage.data.result[0].values.map((x: any) => x[1])}
                />
            }
            <Label>% использование диска</Label>
        </ChartContainer>
        <ChartContainer>
            {
                free && <Chart
                    min={0}
                    max={100}
                    data={free.data.result[0].values.map((x: any) => x[1])}
                />
            }
            <Label>% занятое место</Label>
        </ChartContainer>
        <ChartContainer>
            {
                cpuTemp && 
                <Chart
                    min={0}
                    max={100}
                    data={cpuTemp.data.result[0].values.map((x: any) => x[1]) || [0]}
                />
            }
            <Label>^C температура CPU</Label>
        </ChartContainer>
        {/* <ThemeProvider theme={darkTheme}>
            <Papper>
                {
                    data &&
                    <LineChart
                        xAxis={[{ data: data.data.result[0].values.map((x: any) => x[0]) }]}
                        series={[{ data: data.data.result[0].values.map((x: any) => x[1]), color: theme.colors.primary }]}
                        grid={{ vertical: true, horizontal: true }}
                        yAxis={[{ min: 0, max: 100 }]}
                        height={250}
                    />
                }
                <Label>% CPU usage</Label>
            </Papper>
            <Papper>
                {
                    ramUsage &&
                    <LineChart
                        xAxis={[{ data: ramUsage.data.result[0].values.map((x: any) => x[0]) }]}
                        series={[{ data: ramUsage.data.result[0].values.map((x: any) => x[1]), color: theme.colors.primary }]}
                        yAxis={[{ min: 0, max: 100 }]}
                        grid={{ vertical: true, horizontal: true }}
                        height={250}
                    />
                }
                <Label>% RAM usage</Label>
            </Papper>
            <Papper>
                {
                    diskUsage &&
                    <LineChart
                        xAxis={[{ data: diskUsage.data.result[0].values.map((x: any) => x[0]) }]}
                        series={[{ data: diskUsage.data.result[0].values.map((x: any) => x[1]), color: theme.colors.primary }]}
                        yAxis={[{ min: 0, max: 100 }]}
                        grid={{ vertical: true, horizontal: true }}
                        height={250}
                    />
                }
                <Label>% disk usage</Label>
            </Papper>
            <Papper>
                {
                    free &&
                    <LineChart
                        xAxis={[{ data: free.data.result[0].values.map((x: any) => x[0]) }]}
                        series={[{ data: free.data.result[0].values.map((x: any) => x[1]), color: theme.colors.primary }]}
                        yAxis={[{ min: 0, max: 100 }]}
                        grid={{ vertical: true, horizontal: true }}
                        height={250}
                    />
                }
                <Label>% disk space usage</Label>
            </Papper>
            <Papper>
                {
                    cpuTemp &&
                    <LineChart
                        xAxis={[{ data: cpuTemp.data.result[0].values.map((x: any) => x[0]) }]}
                        series={[{ data: cpuTemp.data.result[0].values.map((x: any) => x[1]), color: theme.colors.primary }]}
                        yAxis={[{ min: 0, max: 100 }]}
                        grid={{ vertical: true, horizontal: true }}
                        height={250}
                    />
                }
                <Label>^C CPU temp</Label>
            </Papper>
        </ThemeProvider> */}
    </Wrapper>
};

const ChartContainer = styled(Papper)`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 10px;
`;

type ChartProps = {
    min: number;
    max: number;
    data: Array<number>;
};

const Chart: FC<ChartProps> = ({ min, max, data }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const theme = useTheme();

    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const ctx = ref.current.getContext("2d");
        if (!ctx) {
            return;
        }

        ctx.clearRect(0, 0, size.w, size.h);
        ctx.strokeStyle = theme.colors.primary;
        ctx.lineWidth = 5;
        const gradient = ctx.createLinearGradient(0, 0, 0, size.h);
        gradient.addColorStop(1 - (Math.max(...data) - min)/(max - min), `color-mix(in oklab, ${theme.colors.primary}, transparent`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, size.h);
        data.forEach((e, i, arr) => {
            ctx.lineTo(size.w / (arr.length - 1) * i,size.h - (e! - min)/(max - min) * size.h)
        });
        ctx.lineTo(size.w, size.h);
        ctx.lineTo(0, size.h);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, size.h - (data[0]! - min)/(max - min) * size.h);
        data.forEach((e, i, arr) => {
            ctx.lineTo(size.w / (arr.length - 1) * i,size.h - (e - min)/(max - min) * size.h)
        });
        ctx.stroke()

    }, [ref.current, size, data, theme]);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((e) => {
            setSize({
                w: e[0]!.contentRect.width,
                h: e[0]!.contentRect.height,
            });
        });

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };

    }, [containerRef.current, setSize]);


    return <ChartWrapper ref={containerRef}>
        <ChartCanvas ref={ref} width={size.w} height={size.h}></ChartCanvas>
    </ChartWrapper>
};

const ChartWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const ChartCanvas = styled.canvas`
    position: absolute;
    left: 0;
    top: 0;
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);

    & > * {
        overflow: hidden;
    }
`;