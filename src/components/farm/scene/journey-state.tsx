"use client";
import { createContext } from "react";
import { freshProgress } from "@/farm/game/progress";
export const JourneyProgress = createContext(freshProgress());
