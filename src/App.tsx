import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SessionProvider } from './mocks/mockSession';
import { MainPage } from './pages/MainPage';
import { ListPage } from './pages/ListPage';
import { QuestionPage } from './pages/QuestionPage';

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            <Route
              path="/questions"
              element={
                <ProtectedRoute>
                  <ListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/new"
              element={
                <ProtectedRoute>
                  <QuestionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions/:id"
              element={
                <ProtectedRoute>
                  <QuestionPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
