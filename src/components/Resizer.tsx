import React, { FC } from "react";
import css from "./Resizer.scss";

export interface ResizerProps {}

export const Resizer: FC<ResizerProps> = () => {
  return <div className={css.resizer}></div>;
};
