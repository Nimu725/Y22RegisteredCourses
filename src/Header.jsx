function Header() {

  return (

    <div className="bg-white shadow-md mb-6">

      <div className="max-w-7xl mx-auto flex items-center gap-4 p-4">

        <img
          src="/csit_logo.jpg"
          alt="CSIT Logo"
          className="h-16"
        />

        <div>

          <div className="text-xl font-bold text-blue-800">
            B.Tech in Computer Science & Information Technology (CS&IT)
          </div>

          <div className="text-gray-600">
            KL University, Vaddeswaram, Green Fields, Guntur
          </div>

        </div>

      </div>

    </div>

  );

}

export default Header;