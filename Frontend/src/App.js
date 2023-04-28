import './App.css';
import Header from './Components/Header';
import About from './Components/About';
import Services from './Components/Services';
import Team from './Components/Team';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import { Element } from 'react-scroll';
import FileUpload from './Components/FileUpload';
function App() {
  return (
    <div>
        <Navbar/>
      <Element name="header" className="element">
        <FileUpload/>
      </Element>
      <Element name="about" className="element">
        <About/>
      </Element>
      <Element name="services" className="element">
        <Services/>
      </Element>
      <Element name="team" className="element">
        <Team/>
      </Element>
      <Footer/>
    </div>
  );
}
export default App;
