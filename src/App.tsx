import { FormEvent, useEffect, useReducer } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Select,SelectContent,SelectGroup,SelectItem,SelectTrigger,SelectValue,} from "./components/ui/select"
import { Slider } from "./components/ui/slider"
import { MAX_ARRAY_LENGTH, MAX_SPEED, MIN_ARRAY_LENGTH, MIN_SPEED, OPERATIONS_PER_SECOND, SORTING_ALGORITHMS } from "./constsnts"
import { cn, getRandomElements, reducer } from "./lib/utils"
import { SortingAlgorithm } from "./types"


export default function App() {
  const [
    {
      sortingAlgorithm,
      sortingSpeed,
      randomArray,
      activeIndices,
      sortedIndices,
      activeSortingFunction,
      isSorting,
    },
    dispatch,
  ] = useReducer(reducer, {
    sortingAlgorithm: "bubble",
    sortingSpeed: 1,
    randomArray: getRandomElements(100),
    activeIndices: [],
    sortedIndices: [],
    isSorting: false,
  })

  useEffect(() => {
    let cancel = false
    let timeout: NodeJS.Timeout
    async function inner() {
      while (activeSortingFunction != null && isSorting && !cancel) {
        const {
          done,
          value: [active, sorted],
        } = activeSortingFunction.next()

        if (done) {
          dispatch({ type: "FINISH_SORTING" })
          return
        }

        dispatch({ type: "SET_INDICES", payload: { active, sorted } })
        await new Promise<void>(resolve => {
          timeout = setTimeout(
            resolve,
            1000 / OPERATIONS_PER_SECOND / sortingSpeed
          )
        })
      }
    }

    inner()

    return () => {
      clearTimeout(timeout)
      cancel = true
    }
  }, [activeSortingFunction, sortingSpeed, isSorting])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (isSorting) {
      dispatch({ type: "STOP" })
    } else {
      dispatch({ type: "SORT" })
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="container pt-4 flex items-center flex-col gap-8 pb-4 lg:gap-24 lg:pb-8 lg:flex-row">
        <h1 className="font-bold text-2xl grow-1">Sort Visualizer</h1>
        <form
          className="grid gap-4 items-end grid-cols-2 md:grid-cols-4 md:gap-8"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="algorithm">Algorithm</Label>
            <Select
              disabled={isSorting}
              value={sortingAlgorithm}
              onValueChange={e =>
                dispatch({
                  type: "CHANGE_ALGORITHM",
                  payload: e as SortingAlgorithm,
                })
              }
            >
              <SelectTrigger id="algorithm" className="capitalize w-full">
                <SelectValue placeholder="Sorting Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SORTING_ALGORITHMS.map(algorithm => (
                    <SelectItem
                      key={algorithm}
                      value={algorithm}
                      className="capitalize"
                    >
                      {algorithm}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="amountOfItems">Amount</Label>
            <Input
              disabled={isSorting}
              id="amountOfItems"
              type="number"
              defaultValue={randomArray.length}
              onChange={e =>
                dispatch({
                  type: "CHANGE_ARRAY_LENGTH",
                  payload: e.target.valueAsNumber,
                })
              }
              max={MAX_ARRAY_LENGTH}
              min={MIN_ARRAY_LENGTH}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-32 md:gap-2">
            <Label htmlFor="speed">
              Speed <small>({sortingSpeed}x)</small>
            </Label>
            <div className="h-9 flex items-center">
              <Slider
                id="speed"
                value={[sortingSpeed]}
                onValueChange={e =>
                  dispatch({ type: "CHANGE_SPEED", payload: e[0] })
                }
                max={MAX_SPEED}
                min={MIN_SPEED}
                step={1}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={isSorting ? "accent" : "default"}>
              {isSorting ? "Stop" : "Sort"}
            </Button>
            <Button
              onClick={() => dispatch({ type: "RANDOMIZE" })}
              disabled={isSorting}
              type="button"
              variant="outline"
            >
              Randomize
            </Button>
          </div>
        </form>
        <div className="grow-1" />
      </header>
      <main className="flex items-end w-full grow  overflow-hidden">
        {randomArray.map((value, index) => (
          <div
            key={index}
            className={cn(
              "grow flex items-end justify-center pb-2 bg-muted",
              sortedIndices.includes(index) && "bg-secondary",
              activeIndices.includes(index) && "bg-accent"
            )}
            style={{ height: `${value}%` }}
          />
        ))}
      </main>
    </div>
  )
}
