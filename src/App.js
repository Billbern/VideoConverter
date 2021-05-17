import './App.css';
import './components/uploader';
import Header from './components/header';
import Uploader from './components/uploader';

function App() {
  return (
    <div className="App">
      <Header/>
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
