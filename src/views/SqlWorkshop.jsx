import { useEffect, useMemo, useState } from "react";
import SegmentedControl from "../components/SegmentedControl.jsx";
import FreeMode from "../components/sql/FreeMode.jsx";
import PracticeMode from "../components/sql/PracticeMode.jsx";
import TaskView from "../components/sql/TaskView.jsx";
import TrackOverview from "../components/sql/TrackOverview.jsx";
import { loadEngine, newDatabase, runSelect, runScript } from "../lib/sqlEngine.js";
import { examTrackSections, locate, topicSections } from "../lib/sqlTracks.js";
import { KEYS, load, save } from "../lib/storage.js";

const MODES = [
  { id: "ovningar", label: "Ämnen" },
  { id: "tenta", label: "Tentanivå" },
  { id: "slump", label: "Slump" },
  { id: "fritt", label: "Fritt läge" },
];

const engine = { newDatabase, runSelect, runScript };

// Ett spår: översikten, eller en öppen uppgift. Senaste uppgiften och om den
// stod öppen sparas per spår, så att man kommer tillbaka dit man var.
function Track({ id, sections, overview, backLabel, sqlProgress, onSolve, onReset, exam }) {
  const [place, setPlace] = useState(() => load(KEYS.sqlOpen, {})[id] ?? {});
  const open = place.open && locate(sections, place.id);

  function remember(next) {
    setPlace(next);
    save(KEYS.sqlOpen, { ...load(KEYS.sqlOpen, {}), [id]: next });
  }

  if (open) {
    return (
      <TaskView
        sections={sections}
        itemId={place.id}
        progress={sqlProgress}
        engine={engine}
        onSolve={onSolve}
        onReset={onReset}
        onOpen={(itemId) => remember({ id: itemId, open: true })}
        onClose={() => {
          remember({ id: place.id, open: false });
          window.scrollTo({ top: 0 });
        }}
        backLabel={backLabel}
        exam={exam}
      />
    );
  }

  return (
    <TrackOverview
      {...overview}
      sections={sections}
      progress={sqlProgress}
      lastId={place.id}
      onOpen={(itemId) => {
        remember({ id: itemId, open: true });
        window.scrollTo({ top: 0 });
      }}
    />
  );
}

const solvedTitle = (solved, total) => (solved === total ? `Alla ${total} lösta` : `${solved} av ${total} lösta`);

export default function SqlWorkshop({ course, sqlProgress, onSolve, onReset }) {
  const [mode, setModeState] = useState(() => {
    const saved = load(KEYS.sqlMode, "ovningar");
    return MODES.some((item) => item.id === saved) ? saved : "ovningar";
  });
  const setMode = (next) => {
    setModeState(next);
    save(KEYS.sqlMode, next);
  };
  const [engineState, setEngineState] = useState("loading");
  const topics = useMemo(() => topicSections(course), [course]);
  const examTrack = useMemo(() => examTrackSections(course), [course]);

  // sql.js laddas först när läget öppnas — inte vid appens start.
  useEffect(() => {
    let alive = true;
    loadEngine()
      .then(() => alive && setEngineState("ready"))
      .catch(() => alive && setEngineState("error"));
    return () => {
      alive = false;
    };
  }, []);

  if (topics.length === 0) {
    return (
      <p className="card p-5 text-[15px] text-ink/70">
        Den här delkursen har inga SQL-övningar inlagda.
      </p>
    );
  }

  const shared = { sqlProgress, onSolve, onReset };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h1 className="font-display text-2xl">SQL-verkstad</h1>
        <div className="w-full sm:w-auto sm:min-w-[27rem]">
          <SegmentedControl label="Välj läge" segments={MODES} value={mode} onChange={setMode} />
        </div>
      </div>

      {engineState === "loading" && (
        <p className="card p-4 text-[15px] text-ink/70">Startar databasen…</p>
      )}
      {engineState === "error" && (
        <p className="card border-wrong/30 p-4 text-[15px] text-ink/80">
          Databasen kunde inte startas. Ladda om sidan och försök igen.
        </p>
      )}

      {engineState === "ready" && mode === "ovningar" && (
        <Track
          id="ovningar"
          sections={topics}
          backLabel="Alla ämnen"
          overview={{
            kicker: "Ämnen",
            title: solvedTitle,
            intro:
              "Byggstenarna en i taget, med en genomgång till varje ämne. Du skriver T-SQL som i SQL Server mot en riktig databas i webbläsaren och får svaret rättat. Databasen byggs om före varje körning, så inget du gör kan förstöra den.",
          }}
          {...shared}
        />
      )}

      {engineState === "ready" && mode === "tenta" && (
        <Track
          id="tenta"
          sections={examTrack}
          backLabel="Tentanivå"
          exam
          overview={{
            kicker: "Tentanivå",
            title: solvedTitle,
            intro:
              "Tentans uppgift 4 är en enda fråga på 30 poäng, och i alla tre tentorna på tabellerna Student, Course och HasStudied. Här tränar du den formen på samma tabeller, steg för steg fram till sammansatta frågor som tentornas. Rättningen räknar som SQL Server.",
          }}
          {...shared}
        />
      )}

      {engineState === "ready" && mode === "slump" && (
        <PracticeMode engine={engine} courseExercises={course.sqlExercises} />
      )}

      {engineState === "ready" && mode === "fritt" && <FreeMode />}
    </div>
  );
}
