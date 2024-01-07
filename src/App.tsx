import { Route, Routes } from 'react-router-dom';
import { MainMap } from './components/Map/MainMap';
import { Suspense } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="grid">
      <Header />
      <main id="section-example">
        <Suspense fallback={<div>Page is Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainMap />} />
          </Routes>
        </Suspense>
        {/* <AddForm /> */}
      </main>
      <Footer />
      {/* <ButtonMenu /> */}
    </div>
  );
}

export default App;
