import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CycleContext } from "../..";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CycleContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0"); // Corrigido: '0' (string) em vez de 0 (número)
  const seconds = String(secondsAmount).padStart(2, "0"); // Corrigido: '0' (string) em vez de 0 (número)

  useEffect(() => {
    if (activeCycle) {
      document.title = `Pomodoro Timer | ${minutes}: ${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>; // Tipo dinâmico adequado
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    setSecondsPassed,
    markCurrentCycleAsFinished,
  ]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
