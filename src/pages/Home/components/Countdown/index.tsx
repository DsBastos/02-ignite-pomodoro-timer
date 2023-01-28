import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'
import { CountdownContainer, Seperator } from './styles'

interface CountdownProps {
  activeCycle: any
  setCycles: any
  setCycleId: any
}

export function Countdown({
  activeCycle,
  setCycles,
  setCycleId,
}: CountdownProps) {
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  /*
    1. Se o ciclo estiver ativo, o total de segundos é o total de minutos do ciclo * 60
    2. Se o ciclo estiver ativo, os segundos atuais é o total de segundos - os segundos passados
  */
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        )
        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            })
          )
          setAmountSecondsPassed(totalSeconds)

          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
      setAmountSecondsPassed(0)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>

      <Seperator>:</Seperator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
