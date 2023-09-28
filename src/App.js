import React, {useState} from "react";
import "./App.css";
import AuthenticateDevice from "./components/AuthenticateDevice";
import RegisterDevice from "./components/RegisterDevice";
window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RegisterDevice />
        <AuthenticateDevice />
      </header>
    </div>
  );
}

export default App;
