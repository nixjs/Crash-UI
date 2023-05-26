import React, { useState } from "react";
import classNames from "classnames";
import BigNumber from "bignumber.js";
import viteLogo from "./assets/icon/free/sprite.svg";
import "./App.css";
import { ProgressBarCounter } from "./ProgressBarCounter";
// import { Schema, Model, uint32, uint64, int16, string, uint8 } from "./buffer";

// const commentSchema = new Schema({
//   id: string,
//   code: uint32,
//   formattedCode: string,
//   drawTime: uint32,
//   configId: string,
//   status: uint8,
//   gameSymbol: uint8,
//   luckyNumbersList: [uint8],
//   xDMaxLuckyNumbersList: [uint8],
// });
// const post = new Model(commentSchema);

// // Typescript knows `result` is of type {x: number, y: number}
const data = {
  id: "500027323591264",
  code: 12297,
  formattedCode: "#012297",
  drawTime: 1684837500,
  configId: "4898947120",
  status: 1,
  gameSymbol: 6,
  luckyNumbersList: [],
  xDMaxLuckyNumbersList: [],
};
// const result = post.toBuffer(data);

// console.log({
//   root: data,
//   result,
//   from: post.fromBuffer(result),
// });

import { BufferSchema, Model } from "./buffer2";
import { uint8, uint32, string8 } from "./buffer2";

const playerSchema = BufferSchema.schema("player", {
  id: { type: string8, length: 2 ^ (64 - 1), trim: true },
  code: uint32,
  formattedCode: { type: string8, length: 2 ^ (64 - 1), trim: true },
  drawTime: uint32,
  configId: { type: string8, length: 2 ^ (64 - 1), trim: true },
  status: uint8,
  gameSymbol: uint8,
  luckyNumbersList: [uint8],
  xDMaxLuckyNumbersList: [uint8],
});

const mainModel = new Model(playerSchema, 8);
const buffer = mainModel.toBuffer(data);

export const randomNumberUnique = (min: number, max: number) =>
  ~~(Math.random() * (max - min + 1)) + min;

const BaseTimer = 5;
const BaseMaxLines = 4;

function App() {
  const [rate, setRate] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeTimer, setActiveTimer] = useState(false);

  const crashWrapper = React.useRef<HTMLDivElement | null>(null);
  const crashChartContainer = React.useRef<HTMLDivElement | null>(null);
  const crashSvg = React.useRef<SVGSVGElement | null>(null);

  const [numbers, setNumbers] = useState<string[]>([]);
  const [percent, setPercent] = useState(0);
  const [crashContainerWidth, setCrashContainerWidth] = useState(0);
  const [currentChartWidth, setCurrentChartWidth] = useState(0);
  const [currentChartHeight, setCurrentChartHeight] = useState(0);
  const [viewBoxHeight, setViewBoxHeight] = useState(0);
  const [pathD, setPathD] = useState("");

  const rateRef = React.useRef(0);

  const handleRandomFlyingPoint = () => {
    rateRef.current = setInterval(() => {
      setRate((prev) => prev + 0.01);
    }, randomNumberUnique(100, 300));
  };

  const handleRandomTimeLeft = () => {
    setTimeLeft(BaseTimer);
    setActiveTimer(true);
  };

  React.useEffect(() => {
    return () => clearInterval(rateRef.current);
  }, []);

  React.useEffect(() => {
    if (rate >= randomNumberUnique(4, 6)) {
      setRate(1);
      clearInterval(rateRef.current);
      handleRandomTimeLeft();
    }
  }, [rate]);

  React.useEffect(() => {
    handleRandomTimeLeft();
  }, []);

  const endRange = React.useCallback(() => rate * 1.5, [rate]);

  React.useEffect(() => {
    const rangeHalf = endRange() / BaseMaxLines;
    const result = [1];

    for (let i = 0; i < BaseMaxLines - 2; i++) {
      const num = parseFloat((result[i] + rangeHalf).toFixed(2));
      result.push(num);
    }

    result.push(endRange());

    const list = result
      .sort((a, b) => a + b)
      .map((number) => {
        const chanks = number.toString().split(".");
        return `${chanks[0]}.${
          chanks.length > 1 ? chanks[1].split("")[0] : 0
        }0`;
      });
    setNumbers(list.reverse());
  }, [endRange, setNumbers]);

  React.useEffect(() => {
    const res = rate * 100 - 100;
    setPercent(res >= 100 ? 100 : res);
  }, [rate]);

  React.useEffect(() => {
    const width = crashContainerWidth;
    const height = viewBoxHeight;
    const offset = 8;
    const width1 = width / 3;
    const height1 = height / 2;

    const x0y0 = `M ${offset},${height - offset}`;
    const x1y1 = `${width1},${height1}`;
    const x2y2 = `${width1 * 2},${height1}`;
    const x3y3 = `${width - offset},${height - offset}`;

    const q1 = `Q ${(width1 / 3) * 2},${height - height1 / 3}`;
    const q2 = `Q ${width / 2},0`;
    const q3 = `Q ${width1 * 2 + width1 / 3},${height - height1 / 3}`;

    setPathD(`${x0y0} ${q1} ${x1y1} ${q2} ${x2y2} ${q3} ${x3y3}`);
  }, [crashContainerWidth, viewBoxHeight]);

  React.useEffect(() => {
    if (crashChartContainer.current) {
      setCrashContainerWidth(crashChartContainer.current.clientWidth - 30);
    }
  }, []);

  React.useEffect(() => {
    if (crashWrapper.current) {
      setCurrentChartWidth(crashWrapper.current.clientWidth);
      const clientHeight = (crashWrapper.current.clientHeight / 3) * 2;
      const height = parseFloat(
        String((rate * 100 - 100) * (clientHeight / 100))
      );
      setCurrentChartHeight(
        height < 30 || !activeTimer
          ? 30
          : height >= clientHeight
          ? clientHeight - 2
          : height - 2
      );
      setViewBoxHeight(
        height < 30 || !activeTimer
          ? 30
          : height >= clientHeight
          ? clientHeight - 2
          : height - 2
      );
    }
  }, [activeTimer, rate]);

  const handleComplete = () => {
    setTimeLeft(0);
    handleRandomFlyingPoint();
  };

  return (
    <div className="container layout__body pt-10 pb-10">
      <div className="grid grid-cols-8 gap-1.5">
        <div className="col-span-8 p-12 bg-white lg:col-span-3 rounded-xl"></div>
        <div className="col-span-8 lg:col-span-5">
          <div className="px-8 py-6 bg-white rounded-xl">
            <div className="crash">
              <div ref={crashWrapper} className="crash__wrapper">
                <ul className="crash__lines">
                  {numbers.map((item, idx) => (
                    <li className="crash__line" key={idx}>
                      {item}
                    </li>
                  ))}
                </ul>
                <div
                  className={classNames(
                    "crash__rate",
                    rate > 1 ? "show" : "hidden"
                  )}
                >
                  <div
                    className="crash__ticker"
                    style={{ bottom: `${percent / 2}%` }}
                  >
                    <svg className="crash__background">
                      <use xlinkHref={`${viteLogo}#crash-label`}></use>
                    </svg>
                    <div className="crash__ticker--count">
                      {new BigNumber(rate).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div ref={crashChartContainer} className="crash__chart">
                  <div
                    className={classNames(
                      "crash__countdown",
                      timeLeft > 0 && activeTimer ? "show" : "hidden"
                    )}
                  >
                    <span className="flex items-center">
                      <svg className="w-6 h-5 mr-2">
                        <use xlinkHref={`${viteLogo}#clock`}></use>
                      </svg>
                      {timeLeft > 0 && (
                        <ProgressBarCounter
                          time={timeLeft}
                          max={timeLeft}
                          onCompleted={handleComplete}
                        />
                      )}
                    </span>
                  </div>
                  <svg
                    ref={crashSvg}
                    className="crash__svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={`0 0 ${crashContainerWidth} ${viewBoxHeight}`}
                    width={currentChartWidth}
                    height={currentChartHeight}
                  >
                    <defs>
                      <linearGradient id="header-shape-gradient" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffb200" />
                        <stop offset="40%" stopColor="#ffb200" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                    <path
                      stroke="#ffb200"
                      strokeWidth="4px"
                      fill="url(#header-shape-gradient) transparent"
                      strokeLinecap="round"
                      d={pathD}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
