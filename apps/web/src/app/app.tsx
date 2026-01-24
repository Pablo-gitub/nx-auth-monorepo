import { ToastContainer } from 'react-toastify';
import { AppRouter } from './routes/AppRouter';

export function App() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
