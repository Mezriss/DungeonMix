import { createContext } from "react";
import type { State } from "@/state";

export const BoardStateContext = createContext<State>(null!);
