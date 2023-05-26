import React from "react";
import { CSS } from "@stitches/react";
import classNames from "classnames";
import { ProgressBarStyled } from "./index.styled";

export interface ProgressBarCounterPropArg {
  time: number;
  max?: number;
  label?: string;
  className?: string;
  onCompleted: () => void;
  overrideStyled?: CSS;
}

const BaseInterval = 1 / 100; // 1/100sec
const BasePercent = 100; // 100%
const BaseMax = 10; // 10sec

export const ProgressBarCounter: React.FC<ProgressBarCounterPropArg> = ({
  time = 10,
  max = BaseMax, // 10sec
  label = "Starting in",
  className,
  onCompleted,
  overrideStyled,
}) => {
  const [seconds, setSeconds] = React.useState(time - 1);
  const [miliseconds, setMiliseconds] = React.useState(100);
  const [percent, setPercent] = React.useState(BasePercent); // 100%

  React.useEffect(() => {
    const allTime = max * 1000;
    let timer = (max - time) * 1000;
    let counter = miliseconds;
    let secCounter = seconds;
    let loopTime = 0;

    const per = 100 - (timer * 100) / allTime;
    setPercent(per);
    const intervalNum = setInterval(() => {
      loopTime += 1;
      if (loopTime === 100) {
        secCounter -= 1;
        setSeconds(secCounter);
        loopTime = 0;
      }
      timer += BaseInterval * 1000;
      if (timer <= max * 1000) {
        counter -= 1;
        if (counter >= 0) {
          setMiliseconds(counter);
        } else {
          counter = 99;
          setMiliseconds(counter);
        }
        const per = 100 - (timer * 100) / allTime;
        setPercent(per);
      } else {
        onCompleted?.();
        clearInterval(intervalNum);
      }
    }, BaseInterval * 1000);
    return () => {
      clearInterval(intervalNum);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProgressBarStyled
      css={overrideStyled}
      className={classNames("text-center w-100", className)}
    >
      <span className="d-block mb-16 text-20">{`${label} ${
        seconds > 0 ? seconds : 0
      }.${miliseconds < 10 ? `0${miliseconds}` : miliseconds}s`}</span>
      <input
        type="range"
        className="m-auto d-block slider"
        value={percent}
        min="0"
        max="100"
        readOnly
      />
    </ProgressBarStyled>
  );
};
