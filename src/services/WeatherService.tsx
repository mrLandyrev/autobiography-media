import React, { useEffect } from "react";
import { useLazyGetForecastQuery } from "../store/weather/api";
import { useDispatch } from "react-redux";
import { setForecast } from "../store/weather/slice";

export const WeatherService: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [getForecast] = useLazyGetForecastQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        const update = async () => {
            const forecast = await getForecast(undefined);
            if (!forecast.data) {
                return
            }
            dispatch(setForecast(forecast.data))
        }
        const interval = setInterval(() => {
            update()
        }, 10 * 60 * 1000);
        update()
        return () => {
            clearInterval(interval);
        }
    }, [])

    return <>{children}</>
};