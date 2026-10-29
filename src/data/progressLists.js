// Övningslistorna vars bockar ligger som sysb23:modell:<id> och som App
// läser in vid start (loadModelProgress). En vy som visar bockar för en
// lista måste ha den här — scripts/progress-lists.test.mjs kontrollerar det.
import { modelExercises } from "./databaser/modelExercises.js";
import { normalizeExercises } from "./databaser/normalizeExercises.js";
import { statementExercises } from "./databaser/statementExercises.js";
import { ddlExercises } from "./databaser/ddlExercises.js";
import { tasks as bpmnTasks } from "./process/bpmnTasks.js";

export const MODEL_PROGRESS_LISTS = { modelExercises, normalizeExercises, statementExercises, ddlExercises, bpmnTasks };

export const modelProgressIds = () => Object.values(MODEL_PROGRESS_LISTS).flat().map((item) => item.id);
