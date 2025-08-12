import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AppContextProvider} from "./context/AppContext.jsx";
import "./i18n";
import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import {Suspense} from "react";

createRoot(document.getElementById('root')).render(
    <Suspense fallback={<div>Loading translations...</div>}>
        <AppContextProvider>
            <App />
            <LanguageSwitcher />
        </AppContextProvider>
    </Suspense>
)

