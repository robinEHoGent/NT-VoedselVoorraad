import ThemeToggle from "./ThemeToggle";

function Footer() {
  return (
    <footer className="bg-image-footer text-secondary mb-5 grid h-[55vh] grid-rows-3 bg-cover bg-top bg-no-repeat sm:h-[75vh] md:mb-0 lg:h-[90vh] xl:h-screen">
      <div className="row-start-2 flex flex-col items-center justify-center md:row-start-3 md:justify-start lg:mt-12">
        <h2 className="bold text-4xl">NIMBLE IT</h2>
        <ThemeToggle />
        <p>Nimble it &copy; 2025</p>
      </div>
    </footer>
  );
}

export default Footer;
