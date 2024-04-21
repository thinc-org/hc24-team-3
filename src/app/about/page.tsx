export default function About() {
  return (
    <main className="w-full scroll-smooth">
      <section className="flex h-[80vh] w-full flex-col items-center justify-center bg-hero bg-cover bg-center bg-no-repeat">
        <div className="mb-4 text-center align-top text-3xl font-semibold tracking-tight sm:text-[5rem] md:mb-12">
          <h1 className="text-[5rem]">We Are</h1>
          <h1 className="pt-10 text-[5rem]">
            <span className="text-primary">CU Act</span>
            <span className="text-black">ivities</span>
          </h1>
        </div>
        <div className="mt-10 flex w-screen flex-col items-center justify-center bg-black bg-opacity-35 py-8 md:px-36">
          <p className="w-ful text-center text-base text-secondary sm:text-2xl">
            Unlock the full potential of university life beyond academies
            Discover, engage, and thrive with ease in a vibrant world of
            extracurricular activities Say goodbye to the endless search and
            embrace seamless access to all clubs and events!
          </p>
        </div>
        <button className="mt-10 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform duration-500 ease-in-out hover:scale-125 hover:bg-secondary hover:text-primary">
          <a href="#activities">Discover!</a>
        </button>
      </section>
      {/* section 2 */}
      <section className="mx-auto mt-12 bg-gray-50 px-4 py-6" id="activities">
        <div className="mb-10 mt-5 flex flex-col gap-y-4 py-5 text-center text-7xl font-semibold tracking-tight md:mb-12 md:mt-14">
          <p className="text-primary">Never Miss!</p>
          <p>Any Activity 🏆</p>
        </div>
        <p className="text-center text-base text-black sm:text-2xl md:px-36">
          Unlock the full potential of university life beyond academics
          Discover, engage, and thrive with ease in a vibrant world of
          extracurricular activities Say goodbye to the endless search and
          embrace seamless access to all clubs and events!
        </p>
        <div className="mb-8 flex flex-col items-center justify-center">
          <button className="mt-10 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform duration-500 ease-in-out hover:scale-125 hover:bg-secondary hover:text-primary">
            <a href="/">Explore Activities</a>
          </button>
        </div>
      </section>
      {/* section 3 */}
      <section className="mx-auto mb-12 mt-12 bg-gray-50 px-4 py-4">
        <div className="mb-10 mt-5 flex flex-col gap-y-4 py-5 text-center text-7xl font-semibold tracking-tight md:mb-12 md:mt-14">
          <p className="text-primary">Elevate</p>
          <p>Your Experience 💫</p>
        </div>
        <p className="text-center text-base text-black sm:text-2xl md:px-36">
          Found your new friends? Or maybe you are looking for a new hobby?
          Enjoy the full experience of university life by joining clubs and
          attending events. with the vast majority of clubs all available in one
          place at your fingertips, you can easily find the perfect match for
          you!
        </p>

        <div className="mb-8 flex flex-col items-center justify-center">
          <button className="mt-10 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform duration-500 ease-in-out hover:scale-125 hover:bg-secondary hover:text-primary">
            <a href="/clubs">Join Some Clubs</a>
          </button>
        </div>
      </section>
    </main>
  );
}
