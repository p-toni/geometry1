import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { EssayReader } from './essaySystem/EssayReader';
import { EssaySystemPage } from './essaySystem/EssaySystemPage';
import { EssaySheet } from './home/EssaySheet';
import { HomeLayout } from './home/HomeLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={null} />
          <Route path="writing/:id" element={<EssaySheet />} />
        </Route>
        <Route path="/essay-system" element={<EssaySystemPage />} />
        <Route path="/read/:id" element={<EssayReader />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
