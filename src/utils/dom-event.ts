import { SyntheticEvent } from "react";

export function prevent(e: SyntheticEvent) {
  e.preventDefault();
}
