import { HandPalm, Play } from 'phosphor-react'
import { useContext } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { FormProvider, useForm } from 'react-hook-form'
import { CyclesContext } from '../../context/CyclesContext'

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

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'o tempo mínimo é de 5 minutos')
    .max(60, 'o tempo máximo é de 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  // metodo alternativo para tipar o useForm
  // interface NewCycleFormData {
  //   task: string
  //   minutesAmount: number
  // ⬇️}
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  // Desestruturação ⬇️
  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
    console.log(data)
  }

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
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        {/* 
            {...newCycleForm} é um "spread", 
            pega cada uma das propriedades do "newCycleForm" 
            e passa como uma propriedade para um componente ⬇️ 
          */}
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountDownButton onClick={interruptCurrentCycle} type="button">
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
