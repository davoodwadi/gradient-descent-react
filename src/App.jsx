import { useState } from "react"
import "./App.css"

import {
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  ReferenceLine,
  Area,
  Scatter,
  ScatterChart,
  ReferenceDot,
} from "recharts"
import { makeArr } from "../tools/tools"

function App() {
  let numPoints = 11
  const [lr, setLR] = useState(0.1)
  function LogSlider() {
    return (
      <input
        type="range"
        defaultValue={Math.log10(lr)}
        min={-10}
        max={1}
        onChange={(e) => setLR(Math.pow(10, e.target.value))}
        step={1}
      />
    )
  }

  const square = (x) => {
    if (typeof x === "object") {
      return x.map((item) => (item - 5) ** 2)
    } else {
      return (x - 5) ** 2
    }
  }
  const [w, setW] = useState(makeArr(0, 10, numPoints))
  const [loss, setLoss] = useState(square(w))

  const randomIndex = Math.floor(Math.random() * w.length)
  const getRandomPoint = () => {
    return { w: w[randomIndex], loss: loss[randomIndex] }
  }
  const startingPoint = getRandomPoint()
  console.log("startingPoint", startingPoint)
  const [currentPoint, setCurrentPoint] = useState(startingPoint)
  const initializeW = () => {
    setCurrentPoint(getRandomPoint)
  }
  // console.log("loss", loss);
  // zip the w and loss
  const initialData = w.map((item, i) => {
    return { w: item, loss: loss[i] }
  })

  const [data, setData] = useState(initialData)

  console.log("currentPoint", currentPoint)
  console.log("lr", lr)

  const update = () => {
    const grad = 2 * (currentPoint.w - 5)
    const updatedW = currentPoint.w - grad * lr
    setCurrentPoint({ w: updatedW, loss: square(updatedW) })
    console.log("currentPoint", currentPoint)
  }

  return (
    <div className="mx-auto h-64">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          // width={730}
          // height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="w"
            type="number"
            label={{ value: "w", position: "insideBottomRight", offset: -10 }}
          />
          <YAxis
            type="number"
            label={{ value: "loss", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" /> */}
          <Line type="monotone" dataKey="loss" stroke="#82ca9d" />
          <ReferenceDot
            x={currentPoint.w}
            y={currentPoint.loss}
            label={{
              value: "current w",
              position: "insideBottomRight",
              offset: -10,
            }}
            r={4}
            fill="#8884d8"
            stroke="none"
          />
          {/* <ReferenceDot x={5.5} y={2} r={4} fill="#8884d8" stroke="none" /> */}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex mx-auto bg-slate-100">
        <button onClick={initializeW}>Randomize w</button>
      </div>
      <div>
        <span>Learning Rate</span>
        <LogSlider />
        <span>{lr}</span>
      </div>
      <div>
        <button onClick={update}>Step</button>
      </div>
    </div>
  )
}

export default App
