const Header = ({ title, desc, content }) => {
  return (
    <>
      <header>
        <img
          src="src/assets/radical-logo-white.png"
          className="w-32 h-32"
          alt="radical logo"
        />
      </header>
      <main className="text-center">
        <h1 className="text-h1 font-iranSans text-background-elm">{title}</h1>
        <p className="text-background-white">{desc}</p>
        {content}
      </main>
    </>
  );
};

export default Header;
