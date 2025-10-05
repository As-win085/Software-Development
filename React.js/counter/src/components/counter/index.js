import { Component } from "react"

import "./index.css"

class Counter extends Component {
  state = { count: 0 }
  onIncrement = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }))
  }
  onDecrement = () => {
    this.setState((prevState) => ({ count: prevState.count - 1 }))
  }
  onReset = () => {
    this.setState((prevState) => ({ count: 0}))
  }
  render() {
    const { count } = this.state
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-3xl font-bold mb-5 sm:text-5xl md:mb-7 lg:text-9xl">Count {count}</h1>
        <div className="gap-3 flex flex-col sm:flex-row xl:flex">
          <button className="bg-red-600 text-white shadow-md text-sm px-1 py-2 sm:text-lg sm:px-2 sm:py-3 xl:text-2xl" onClick={this.onDecrement}>
            Decrease
          </button>
          <button className="bg-gray-600 text-white shadow-md text-sm px-1 py-2 sm:text-lg sm:px-2 sm:py-3 xl:text-2xl" onClick={this.onReset}>
            Reset
          </button>
          <button className="bg-green-600 text-white shadow-md text-sm px-1 py-2 sm:text-lg sm:px-2 sm:py-3 xl:text-2xl" onClick={this.onIncrement}>
            Increase
          </button>
        </div>
      </div>
    )
  }
}

export default Counter