/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Track from "./pages/Track";
import Improve from "./pages/Improve";
import Launch from "./pages/Launch";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/track" element={<Track />} />
          <Route path="/improve" element={<Improve />} />
          <Route path="/launch" element={<Launch />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
