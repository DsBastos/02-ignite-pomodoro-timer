import { HandPalm, Play } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

// register: função que vai registrar o input no react-hook-form
/**
 *
 * function register(name:string) {
 *  return {
 *    onChange: () => void,
 *    onBlur: () => void,
 *    onFocus: () => void
 *  }
 *}
 */

interface Cycle {
  id: number
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<number | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = new Date().getTime()

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)

    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          }
        } else {
          return cycle
        }
      })
    )
    setActiveCycleId(null)
  }
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  /*
    3. Se o ciclo estiver ativo, os minutos atuais é o total de segundos atuais / 60
    4. Se o ciclo estiver ativo, os segundos atuais é o resto da divisão do total de segundos atuais por 60
  */
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  const task = watch('task')
  const isSubmitDisabled = !task

  /**
   * Prop Drilling - Quando se tem MUITAS propriedades sendo passadas
   *                 de um componente pai para um componente filho.
   * Exemplo: <ComponentePai propriedade3={valor3} propriedade4={valor4} />
   *          <ComponenteFilho propriedade3={valor3} propriedade4={valor4} />
   *
   * Solução: Context API
   * -> Permitindo compartilhar informações entre VÁRIOS componentes ao mesmo tempo
   */
  return (
    <HomeContainer>
      <form
        onSubmit={handleSubmit(handleCreateNewCycle)}
        activeCycleId={activeCycleId}
        action=""
      >
        <NewCycleForm />
        <Countdown activeCycle={activeCycle} setCycles={setCycles} />

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            <span>Interromper</span>
          </StopCountDownButton>
        ) : (
          <StartCountDownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            <span>Iniciar ciclo</span>
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
