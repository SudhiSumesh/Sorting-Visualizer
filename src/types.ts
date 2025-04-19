import { SORTING_ALGORITHMS } from "./constsnts";

export type SortingAlgorithm = (typeof SORTING_ALGORITHMS)[number]

export type Action =
  | { type: "RANDOMIZE" }
  | { type: "SORT" }
  | { type: "STOP" }
  | { type: "FINISH_SORTING" }
  | { type: "CHANGE_ALGORITHM"; payload: SortingAlgorithm }
  | { type: "CHANGE_SPEED"; payload: number }
  | { type: "CHANGE_ARRAY_LENGTH"; payload: number }
  | { type: "SET_INDICES"; payload: { active: number[]; sorted: number[] } }

export type State = {
  sortingAlgorithm: SortingAlgorithm
  sortingSpeed: number
  randomArray: number[]
  activeIndices: number[]
  sortedIndices: number[]
  activeSortingFunction?: Generator<[number[], number[]]>
  isSorting: boolean
}