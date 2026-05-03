import { Outlet } from "react-router-dom";
import Header from "../Components/header/Header";
import Footer from "../Components/footer/Footer";
import App from "../App";
import ScrollToTop from "../Components/ScrollToTop";

function AppLayout() {
  return (
    <App>
      <ScrollToTop />
      <div className="bg-image-header bg-bg flex h-full flex-col bg-contain bg-position-[-2rem_0rem] bg-no-repeat sm:bg-position-[-2rem_-5rem] lg:bg-position-[-2rem_-7rem] 2xl:bg-position-[-15rem_-13rem]">
        <Header />

        <main className="min-h-screen grow pt-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </App>
  );
}

export default AppLayout;
