
import Dashboard from './components/Dashboard'
import Cnapp from './components/Cnapp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import AddWidget from './components/AddWidget';


function App() {
 

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
     
      <Route path="/addwidget" element={<AddWidget />} />
      <Route path="/onaddwidget" element={<AddWidget />} />
      
     
     
    </Routes>
  )
}

export default App
