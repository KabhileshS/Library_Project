import Home from "./components/FunctionalComponents/Home";
import Login from "./components/FunctionalComponents/Login";
import Signup from "./components/FunctionalComponents/Signup";
import Navbar from "./components/FunctionalComponents/Navbar";
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  return (
    <>
      <div>
        <main>
          <BrowserRouter>
          {/* <Navbar /> */}
            <Routes>
              <Route path='/' element={<Signup/>} />
              <Route path='/login'element={<Login/>}  />
              <Route path='/home' element={<Home/>}/>
            </Routes>
          </BrowserRouter>
        </main>
      </div>
    </>
  );
}

export default App;
