import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { EssayReader } from './essaySystem/EssayReader';
import { EssaySystemPage } from './essaySystem/EssaySystemPage';
import { HomeLayout } from './home/HomeLayout';
import { LegacyWritingRedirect } from './home/LegacyWritingRedirect';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={null} />
        </Route>
        <Route path="/writing/:id" element={<LegacyWritingRedirect />} />
        <Route path="/essay-system" element={<EssaySystemPage />} />
        <Route path="/read/:id" element={<EssayReader />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
