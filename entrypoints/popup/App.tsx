import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";
import { MessageType } from "@/utils/messages";

function App() {
  const [parsedTx, setParsedTx] = useState<any>(null);
  const getParsedTx = async () => {
    console.log("Getting parsed tx from popup");
    const response = await browser.runtime.sendMessage({
      type: MessageType.GET_PARSED_TX,
      payload: {},
    });
    console.log("Response:", response);
    setParsedTx(response);
  };

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <button onClick={getParsedTx}>get parsed tx</button>
        <p>{JSON.stringify(parsedTx)}</p>
      </div>
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </>
  );
}

export default App;
