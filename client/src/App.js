import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import AddRate from './pages/AddRate/AddRate';
import Header from './components/Header/Header';
import UpdateRate from './pages/UpdateRate/UpdateRate';
import Actions from './pages/Actions/Actions';
import Exchange from './pages/Exchange/Exchange';
import RateHistory from './pages/RateHistory/RateHistory';
import AdminReport from './pages/AdminReport/AdminReport';
import Login from './pages/Login/Login';

function App() {
    const userId = localStorage.getItem("userId");

    if(!userId) return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )

    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/historyRate" element={<RateHistory />} />
                <Route path="/action" element={<Actions />} />
                <Route path="/addRate" element={<AddRate />} />
                <Route path="/updateRate/:from" element={<UpdateRate />} />
                <Route path="/report" element={<AdminReport />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
        
    )
}

export default App;