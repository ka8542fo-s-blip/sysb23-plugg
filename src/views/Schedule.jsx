import { useMemo, useState } from "react";
import ExamCountdown from "../components/schedule/ExamCountdown.jsx";
import TermOverview from "../components/schedule/TermOverview.jsx";
import SessionList from "../components/schedule/SessionList.jsx";
import { schedule } from "../data/schedule.js";
import { getCourse } from "../data/index.js";
import {
  decoratedExams,
  nextExam,
  termState,
  currentPeriod,
} from "../lib/scheduleInfo.js";
import { readinessFor, pacingFor } from "../lib/readiness.js";
import { studyTargetFor, startStudying, STUDY_LABEL } from "../lib/studyPlan.js";
import { daysUntil, formatFullDate, formatSwedish } from "../lib/dates.js";
import { loadExamRegistrations, saveExamRegistration } from "../lib/storage.js";
import { useToday } from "../lib/useToday.js";

// Schemat kopplar terminens datum till pluggstatus: hur nära nästa tenta
// ligger och hur långt du kommit i materialet för den.
export default function Schedule({ answers, exams: examHistory, navigate, onSelectCourse }) {
  // Datumet är reaktivt så att nedräkningar och passerat-markeringar
  // följer med om fliken står öppen över midnatt.
  const now = useToday();
  const exams = useMemo(() => decoratedExams(schedule), [now]);
  const next = useMemo(() => nextExam(schedule), [now]);
  const state = termState(schedule);
  const period = currentPeriod(schedule);

  // Anmäld i Ladok, per examination. Kryssrutorna finns i tentalistan.
  const [registrations, setRegistrations] = useState(() =>
    loadExamRegistrations(schedule.exams.map((exam) => exam.id)),
  );
  function toggleRegistration(examId, isRegistered) {
    saveExamRegistration(examId, isRegistered);
    setRegistrations((prev) => {
      const next = { ...prev };
      if (isRegistered) next[examId] = true;
      else delete next[examId];
      return next;
    });
  }

  // Beredskap för en tenta, om delkursen har innehåll i appen.
  function readinessForExam(exam) {
    const contentId = exam.subcourseData?.contentId;
    if (!contentId) {
      const neutral = "Material saknas i appen än.";
      return { sentence: neutral, short: neutral, pacing: null };
    }
    const course = getCourse(contentId);
    const readiness = readinessFor({
      course,
      answers,
      exams: examHistory,
    });
    return {
      ...readiness,
      short: readiness.sentence,
      pacing: exam.past ? null : pacingFor(readiness, exam.date),
    };
  }

  // Knappen visas bara för delkurser som har material i appen.
  function studyTarget(exam) {
    return studyTargetFor(exam.subcourseData);
  }

  function onStudy(exam) {
    startStudying({
      target: studyTarget(exam),
      exam,
      navigate,
      onSelectCourse,
    });
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="font-display text-2xl">Pluggkalender</h1>
        <p className="mt-1 max-w-reading text-[15px] text-ink/70">
          {schedule.term} · {formatSwedish(schedule.termStart)} till{" "}
          {formatSwedish(schedule.termEnd)}. Alla pass och examinationer, med
          nedräkning till nästa tenta.
        </p>
      </section>

      <ExamCountdown
        schedule={schedule}
        exams={exams}
        next={next}
        termState={state}
        daysToTerm={daysUntil(schedule.termStart)}
        readinessFor={readinessForExam}
        studyTargetFor={studyTarget}
        studyLabel={STUDY_LABEL}
        onStudy={onStudy}
        registrations={registrations}
        onToggleRegistration={toggleRegistration}
      />

      <SessionList
        schedule={schedule}
        defaultForwardOnly={state === "during"}
        now={now}
      />

      <TermOverview schedule={schedule} exams={schedule.exams} currentPeriod={period} />

      <section className="border-t border-line pt-5">
        <p className="text-sm leading-relaxed text-ink/65">
          Verifierat mot TimeEdit {formatFullDate(schedule.verifiedOn)}. Schemat kontrollerades
          senast {formatFullDate(schedule.lastChecked)}. Kontrollera alltid aktuell vecka i
          TimeEdit — salar och tider kan ändras.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{schedule.note}</p>
      </section>
    </div>
  );
}
