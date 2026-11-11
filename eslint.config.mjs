import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

export default [
  ...nextVitals,
  prettier,
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
];
