import { Route, Routes } from 'react-router-dom';
import { MainMap } from './components/Map/MainMap';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="grid">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<MainMap />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
