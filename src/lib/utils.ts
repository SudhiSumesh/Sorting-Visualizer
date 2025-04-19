import { MAX_ARRAY_LENGTH, MAX_SPEED, MIN_ARRAY_LENGTH, MIN_SPEED } from "@/constsnts"
import { bubbleSortGenerator } from "@/sortingAlgorithms/bubble"
import { insertionSortGenerator } from "@/sortingAlgorithms/insertion"
import { mergeSortGenerator } from "@/sortingAlgorithms/merge"
import { quickSortGenerator } from "@/sortingAlgorithms/quick"
import { selectionSortGenerator } from "@/sortingAlgorithms/selection"
import { Action, SortingAlgorithm, State } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



 export function getRandomElements(arraySize: number) {
  return Array.from(
    { length: arraySize },
    () => Math.floor(Math.random() * 100) + 1
  )
}

export function getSortingFunction(algorithm: SortingAlgorithm) {
  switch (algorithm) {
    case "bubble":
      return bubbleSortGenerator
    case "insertion":
      return insertionSortGenerator
    case "selection":
      return selectionSortGenerator
    case "quick":
      return quickSortGenerator
    case "merge":
      return mergeSortGenerator
    default:
      throw new Error(`Invalid algorithm: ${algorithm satisfies never}`)
  }
}


 export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "RANDOMIZE":
      if (state.isSorting) return state
      return {
        ...state,
        activeIndices: [],
        sortedIndices: [],
        isSorting: false,
        activeSortingFunction: undefined,
        randomArray: getRandomElements(state.randomArray.length),
      }
    case "SORT":
      return {
        ...state,
        activeSortingFunction:
          state.activeSortingFunction ??
          getSortingFunction(state.sortingAlgorithm)(state.randomArray),
        isSorting: true,
      }
    case "STOP":
      return {
        ...state,
        isSorting: false,
      }
    case "FINISH_SORTING":
      return {
        ...state,
        isSorting: false,
        activeSortingFunction: undefined,
      }
    case "CHANGE_ALGORITHM":
      if (state.isSorting) return state
      return {
        ...state,
        sortingAlgorithm: action.payload,
        activeIndices: [],
        sortedIndices: [],
        activeSortingFunction: undefined,
      }
    case "CHANGE_SPEED":
      if (action.payload > MAX_SPEED || action.payload < MIN_SPEED) return state
      return {
        ...state,
        sortingSpeed: action.payload,
      }
    case "CHANGE_ARRAY_LENGTH":
      if (
        action.payload < MIN_ARRAY_LENGTH ||
        action.payload > MAX_ARRAY_LENGTH ||
        isNaN(action.payload)
      ) {
        return state
      }
      if (state.isSorting) return state
      return {
        ...state,
        activeIndices: [],
        sortedIndices: [],
        isSorting: false,
        activeSortingFunction: undefined,
        randomArray: getRandomElements(action.payload),
      }
    case "SET_INDICES":
      return {
        ...state,
        activeIndices: action.payload.active,
        sortedIndices: action.payload.sorted,
      }
    default:
      throw new Error(`Invalid action: ${action satisfies never}`)
  }
}