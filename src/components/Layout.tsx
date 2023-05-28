import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="max-w-xs mx-auto px-6 h-screen flex flex-col text-slate-700">
      <header className="mt-8">
        <Header />
      </header>
      <main className="mt-4  flex-auto flex flex-col">
        <Outlet />
      </main>

      {/* <footer className="h-12 mb-4 border-t border-gray-200">
        <Footer />
      </footer> */}
    </div>
  );
}
