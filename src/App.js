import './App.css';
import './components/uploader';
import Uploader from './components/uploader';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div>
          <a href="/">Mong<span>Converter</span></a>
          <ul>
            <li>About</li>
            <li>How It Works</li>
            <li>FAQ</li>
          </ul>
        </div>
      </header>
      <main>
        <div className="App_right">
          <Uploader/>
          <div className="App_load">

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
