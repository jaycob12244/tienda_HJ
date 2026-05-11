import Header from "../components/Header";
import Footer from "../components/Footer";
import CursorDotField from "../components/CursorDotField";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-black">
      <CursorDotField />
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
