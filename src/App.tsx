import './App.css'
import Search from './components/Search';

function App() {

  return (
    <div className="App">
      <header>
          <h1 className='site-header'>coinvision.</h1>
          <button className="settings-btn"></button>
      </header>
      <main>
        <Search />
      </main>
    </div>
  )
}

export default App
