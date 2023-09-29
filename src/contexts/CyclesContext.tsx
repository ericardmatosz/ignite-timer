// Import Libs, components and functions

import {
  ReactNode,
  createContext,
  useState,
  useReducer,
  useEffect,
} from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  addNewCycleAction,
  interruptNewCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

// Interfaces

interface createCycleData {
  task: string
  minutesAmount?: number
  durationTime: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleID: string | null
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  markCurrentCycleAsFinished: () => void
  createNewCycle: (data: createCycleData | undefined) => void
  interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

// Context Provider

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleID: null,
    },
    (initialState) => {
      const storedStateJSON = localStorage.getItem(
        '@igite-timer:cycles-state-1.0.0',
      )

      if (storedStateJSON) {
        return JSON.parse(storedStateJSON)
      }

      return {
        initialState,
      }
    },
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  const { cycles, activeCycleID } = cyclesState
  const activeCycle = cycles.find((cycles) => cycles.id === activeCycleID)

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@igite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: createCycleData | undefined) {
    const id = String(new Date().getTime())

    if (data) {
      const newCycle: Cycle = {
        id,
        task: data.task,
        minutes: data.durationTime,
        startDate: new Date(),
      }

      dispatch(addNewCycleAction(newCycle))

      setAmountSecondsPassed(0)
    }
  }

  function interruptCurrentCycle() {
    dispatch(interruptNewCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleID,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
