import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Board } from "../dist";

const App = () => {
  return (
    <div>
      <Board />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
