import { HandPalm, Play } from "phosphor-react";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import { CyclesContext } from "../../contexts/CyclesContext";

import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCicleForm";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  const newCycleValidationSchema = zod.object({
    task: zod.string().min(1),
    durationTime: zod.number().min(5).max(60),
  });

  type newCycleFormData = zod.infer<typeof newCycleValidationSchema>;

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: "",
      durationTime: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch("task");
  const formIsNotValid = !task;

  function handleCreateNewCycle(data: newCycleFormData) {
    createNewCycle(data);

    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={formIsNotValid} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
