import './App.css'
import Draft from './pages/Draft';
import SelectLeague from './pages/SelectLeague';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP3VMZJa6D9zxDD2mmeMMoUfNlWt7qofw",
  authDomain: "mocktion-draft.firebaseapp.com",
  databaseURL: "https://mocktion-draft.firebaseio.com",
  projectId: "mocktion-draft",
  storageBucket: "mocktion-draft.appspot.com",
  messagingSenderId: "605279740949",
  appId: "1:605279740949:web:117804e59e5093ae0a1a1c",
  measurementId: "G-QZF2XM205D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route index element={<SelectLeague/>}/>
        <Route path="draft" element={<Draft/>}/>
      </Routes>
    </BrowserRouter>
      {/* <Draft /> */}
    </>
  )
}

export default App
