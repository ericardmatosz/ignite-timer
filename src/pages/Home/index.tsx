import { Play } from 'phosphor-react'
import {
  HomeContainer,
  FormContainer,
  CountdownContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesDurationInput,
} from './styles'

import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { useForm } from 'react-hook-form'

const newCycleValidationSchema = zod.object({
  task: zod.string().min(1),
  durationTime: zod.number().min(5).max(60),
})

export function Home() {
  type newCicleFormData = zod.infer<typeof newCycleValidationSchema>

  const { register, handleSubmit, watch, reset } = useForm<newCicleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      durationTime: 0,
    },
  })

  function handleSubmitForm(data: newCicleFormData) {
    console.log(data)
    reset()
  }

  const task = watch('task')
  const formIsNotValid = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleSubmitForm)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em </label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestion"
            {...register('task')}
          />

          <datalist id="task-suggestion">
            <option value="Desenvolver uma aplicação web" />
            <option value="Desenvolver uma aplicação mobile" />
            <option value="Desenvolver uma aplicação web e mobile" />
          </datalist>

          <label htmlFor="durationTime">durante</label>
          <MinutesDurationInput
            type="number"
            id="durationTime"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('durationTime', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={formIsNotValid} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
