import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <header className="site-header">
        <div className="container header-content">
          <Header />
        </div>
      </header>
      <main className="container">{children}</main>
      <footer className="site-footer">
        <div className="container">
          <Footer />
        </div>
      </footer>
    </>
  );
}