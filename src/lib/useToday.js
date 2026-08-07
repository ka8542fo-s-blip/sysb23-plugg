import { useEffect, useState } from "react";
import { today } from "./dates.js";

// Dagens datum som reaktivt värde. Komponenter som läser today() direkt
// visar rätt vid varje rendering men märker inte när datumet slår över i
// en flik som står öppen — den här hooken kollar en gång i minuten och
// när fliken får fokus igen (t.ex. en laptop som väcks ur vila).
export function useToday() {
  const [date, setDate] = useState(today);

  useEffect(() => {
    const check = () =>
      setDate((prev) => {
        const next = today();
        return next === prev ? prev : next;
      });
    const id = setInterval(check, 60_000);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  return date;
}
