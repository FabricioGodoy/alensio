import AudioRecorder from './AudioRecorder';
import gifHomero from './gifHomero.gif';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={gifHomero} />
      
        <AudioRecorder/>

      </header>
    </div>
  );
}

export default App;
