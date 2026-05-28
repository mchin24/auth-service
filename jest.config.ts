import { createDefaultEsmPreset } from "ts-jest";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.test`, override: true });

const defaultEsmPreset = createDefaultEsmPreset();

/** @type {import("jest").Config} **/
export default {
  ...defaultEsmPreset,
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
