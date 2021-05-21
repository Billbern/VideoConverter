import { useState } from "react";
import "./App.css";
import "./components/uploader";
import Header from "./components/header";
import Uploader from "./components/uploader";
import Controller from "./components/controller";


function App() {

  const [file, setFile] = useState(null);
  const [input, setInput] = useState({ media: '', format: '' });

  return (
    <div className="App">
      <Header />
      <main>
        <div className="App_right">
          <Controller {...{ file, setInput }} />
          <Uploader {...{ input, setFile }} />
        </div>
      </main>
    </div>
  );
}

export default App;
