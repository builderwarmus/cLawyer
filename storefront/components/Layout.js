import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="main">{children}</main>
      <footer className="footer">
        <p>
          Handmade with care · Powered by your own online shop
        </p>
      </footer>
    </div>
  );
}
