import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { FormContainer, MinutesDurationInput, TaskInput } from "./styles";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em </label>
      <TaskInput
        type="text"
        id="task"
        placeholder="Dê um nome para o seu projeto"
        list="task-suggestion"
        {...register("task")}
        disabled={!!activeCycle}
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
        {...register("durationTime", { valueAsNumber: true })}
        disabled={!!activeCycle}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}
