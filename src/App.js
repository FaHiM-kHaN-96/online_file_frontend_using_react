import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from './Login';
import Body from './Body';
import Signup from './Signup';
import FileManager from './FileManager';
import axios from 'axios';
axios.defaults.withCredentials = true;

function App() {
   return ( 

    <Router>
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      
          <Route
          path="/FileManager"
          element={
            <ProtectedRoute>
              <FileManager />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Login />} />
        
      </Routes>
    </Router>
   
  );
}

export default App;
