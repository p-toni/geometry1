import { GlimmProvider } from 'glimm/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { EssayReader } from './essaySystem/EssayReader';
import { EssaySystemPage } from './essaySystem/EssaySystemPage';
import { HomeLayout } from './home/HomeLayout';
import { NextHome } from './home/next/NextHome';
import { LegacyReadRedirect } from './home/LegacyReadRedirect';
import { GLIMM_ENTER } from './home/glimmEnter';

export default function App() {
  return (
    <BrowserRouter>
      <GlimmProvider {...GLIMM_ENTER}>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={null} />
          </Route>
          <Route path="/writing/:id" element={<LegacyReadRedirect />} />
          <Route path="/read/:id/full" element={<LegacyReadRedirect />} />
          <Route path="/essay-system" element={<EssaySystemPage />} />
          <Route path="/next" element={<NextHome />} />
          <Route path="/read/:id" element={<EssayReader />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GlimmProvider>
    </BrowserRouter>
  );
}
