import Header from "./Header";
import Footer from "./Footer";
import BucketCourses from "./BucketCourses";

function App() {

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col">

      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4">

        <BucketCourses />

      </main>

      <Footer />

    </div>

  );

}

export default App;