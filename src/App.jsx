import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  BookDetails,
  CreateBook,
  Home,
  LandingPage,
  Login,
  ReadPage,
  Signup,
} from "./pages";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-book" element={<CreateBook />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="/books/:bookId/read/:page" element={<ReadPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
