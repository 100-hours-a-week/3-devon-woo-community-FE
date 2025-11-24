import './App.css';

function App() {
  const handleClick = () => {
    window.alert('React + TypeScript boilerplate is running!');
  };

  return (
    <main className="app">
      <div className="card">
        <h1>React + TypeScript</h1>
        <p>Vite + React + TypeScript ready to go.</p>
        <button type="button" onClick={handleClick}>
          Click me
        </button>
      </div>
    </main>
  );
}

export default App;
