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

function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

function App() {
  let numPoints = 110
  const [lr, setLR] = useState(0.1)
  function LogSlider() {
    return (
      <input
        className="accent-indigo-800"
        type="range"
        defaultValue={Math.log10(lr)}
        min={-10}
        max={1}
        onChange={(e) => setLR(Math.pow(10, e.target.value))}
        step={1}
      />
    )
  }

  const getLoss = (x, objective) => {
    if (objective === "square") {
      return (x - 5) ** 2
    } else if (objective === "sin") {
      return Math.sin(x) * 10 + (x - 5) ** 2
    } else if (objective === "saddle") {
      return Math.cos(x) * 10 + (x - 5) ** 2
    }
  }
  const getGrad = (x, objective) => {
    if (objective === "square") {
      return 2 * (x - 5)
    } else if (objective === "sin") {
      return Math.cos(x) * 10 + 2 * (x - 5)
    } else if (objective === "saddle") {
      return -10 * Math.sin(x) + 2 * (x - 5)
    }
  }

  const [objective, setObjective] = useState("saddle")
  // const [w, setW] = useState(makeArr(0, 10, numPoints))
  // const [loss, setLoss] = useState(w.map((item) => getLoss(item, objective)))
  let w = makeArr(0, 10, numPoints)
  let loss = w.map((item) => getLoss(item, objective))

  const getRandomPoint = () => {
    const randomIndex = Math.floor(Math.random() * w.length)
    return { w: w[randomIndex], loss: loss[randomIndex] }
  }
  let startingPoint = getRandomPoint()
  console.log("startingPoint", startingPoint)
  const [currentPoint, setCurrentPoint] = useState(startingPoint)
  const initializeW = () => {
    setCurrentPoint(getRandomPoint)
  }

  // zip the w and loss
  const initialData = w.map((item, i) => {
    return { w: item, loss: loss[i] }
  })

  // const [data, setData] = useState(initialData)
  const data = initialData

  // console.log("currentPoint", currentPoint)
  // console.log("lr", lr)

  const update = () => {
    const grad = getGrad(currentPoint.w, objective)
    const updatedW = currentPoint.w - grad * lr
    setCurrentPoint({ w: updatedW, loss: getLoss(updatedW, objective) })
    console.log("currentPoint", currentPoint)
  }
  const changeObjective = (e) => {
    console.log("objective", objective)
    console.log("e.target.value", e.target.value)
    setObjective(e.target.value)
    w = makeArr(0, 10, numPoints)
    loss = w.map((item) => getLoss(item, e.target.value))
    startingPoint = getRandomPoint()

    setCurrentPoint(startingPoint)
    // setData(initialData)
    console.log("objective", objective)
  }

  return (
    <div className="flex-col mx-auto px-4 py-4 items-center justify-center h-screen">
      <ResponsiveContainer height="50%" width="100%">
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
      <div className="mx-auto py-4 flex px-4 items-center justify-center">
        <label className=" px-2 items-center justify-center">
          <input
            type="radio"
            name="obj"
            value="sin"
            // Checking this radio button if the selected option is "Male"
            checked={objective === "sin"}
            onChange={changeObjective}
          />
          Sine
        </label>

        <label className=" px-2 items-center justify-center">
          <input
            type="radio"
            name="obj"
            value="square"
            // Checking this radio button if the selected option is "Male"
            checked={objective === "square"}
            onChange={changeObjective}
          />
          Square
        </label>
        <label className=" px-2 items-center justify-center">
          <input
            type="radio"
            name="obj"
            value="saddle"
            // Checking this radio button if the selected option is "Male"
            checked={objective === "saddle"}
            onChange={changeObjective}
          />
          Saddle
        </label>
      </div>

      <div className="mx-auto py-4 flex-col px-4 items-center justify-center">
        <p>w: {round(currentPoint.w)}</p>
        <p>loss: {round(currentPoint.loss)}</p>
      </div>
      <div className="mx-auto py-4 flex px-4 ">
        <div className="mx-auto py-4 flex items-center justify-center">
          <button
            className="bg-indigo-200 rounded-md p-3"
            onClick={initializeW}
          >
            Randomize w
          </button>
        </div>
        <div className="mx-auto pt-2 flex-col items-center justify-center ">
          <div className="mx-auto pt-2 flex items-center justify-center ">
            <p>Learning Rate</p>
          </div>
          <div className="mx-auto flex items-center justify-center ">
            <LogSlider />
          </div>
          <div className="mx-auto pb-2 flex items-center justify-center ">
            <p>{lr}</p>
          </div>
        </div>

        <div className="mx-auto py-2 flex items-center justify-center">
          <button className="bg-indigo-200 rounded-md p-3" onClick={update}>
            Step
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
