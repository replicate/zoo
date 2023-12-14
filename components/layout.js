import Nav from "./nav";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
