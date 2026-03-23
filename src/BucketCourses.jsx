import { useEffect, useState } from "react";

function BucketCourses() {

  const [courses, setCourses] = useState([]);
  const [credits, setCredits] = useState([]);

  const [uid, setUid] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {

    // load registered courses
    fetch("/registeredcourses.json")
      .then(res => res.json())
      .then(data => setCourses(data));

    // load course credits
    fetch("/y22-courses-credits.json")
      .then(res => res.json())
      .then(data => setCredits(data));

  }, []);

  // SEARCH FUNCTION
  const handleSearch = () => {

    const id = uid.trim();

    const result = courses.filter(
      r => String(r["University ID"]) === id
    );

    setFiltered(result);

    if (result.length > 0) {

      setStudent({
        id: result[0]["University ID"],
        name: result[0]["Name"]
      });

    } else {

      setStudent(null);

    }

  };

  // CREDIT LOOKUP MAP
  const creditMap = Object.fromEntries(
    credits.map(c => [c["COURSE CODE"], c.CR])
  );

  // GROUP BY BUCKET GROUP
  const grouped = {};

  filtered.forEach(row => {

    const bucket = row["Bucket Group"] || "Others";

    if (!grouped[bucket]) {
      grouped[bucket] = [];
    }

    grouped[bucket].push(row);

  });

  return (

    <div>
      <div className="flex justify-center items-center h-full">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Y22 Batch Student Registered Courses
        </h1>
      </div>


      {/* SEARCH BOX */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex justify-center mb-8"
      >

        <div className="bg-white shadow p-4 rounded flex gap-3">

          <input
            type="text"
            placeholder="Enter University ID"
            className="border p-2 rounded w-64"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>

        </div>

      </form>


      {/* STUDENT DETAILS BOX */}

      {student && (

        <div className="flex justify-center mb-8">

          <div className="bg-blue-50 border border-blue-200 shadow rounded p-4 w-96">

            <div className="text-lg font-semibold text-blue-800 mb-2">
              Student Details
            </div>

            <div>
              <span className="font-semibold">University ID:</span> {student.id}
            </div>

            <div>
              <span className="font-semibold">Name:</span> {student.name}
            </div>

          </div>

        </div>

      )}


      {/* GRID CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {Object.keys(grouped).map(bucket => {

          const rows = grouped[bucket];

          // REMOVE DUPLICATE COURSES
          const uniqueMap = new Map();

          rows.forEach(course => {

            if (!uniqueMap.has(course.CourseCode)) {
              uniqueMap.set(course.CourseCode, course);
            }

          });

          const uniqueCourses = Array.from(uniqueMap.values());

          let totalCredits = 0;

          return (

            <div key={bucket} className="bg-white shadow rounded-lg overflow-hidden">

              {/* RIBBON */}

              <div className="bg-blue-600 text-white px-4 py-2 font-bold">
                {bucket}
              </div>

              <div className="p-3 overflow-x-auto">

                <table className="w-full text-sm border">

                  <thead className="bg-gray-200">

                    <tr>
                      <th className="border p-2">SNo</th>
                      <th className="border p-2">CourseCode</th>
                      <th className="border p-2">CourseDesc</th>
                      <th className="border p-2">CR</th>
                      <th className="border p-2">Semester</th>
                    </tr>

                  </thead>

                  <tbody>

                    {uniqueCourses.map((course, i) => {

                      const cr = creditMap[course.CourseCode] || 0;

                      totalCredits += cr;

                      return (

                        <tr key={i} className="hover:bg-gray-50">

                          <td className="border p-2 text-center">
                            {i + 1}
                          </td>

                          <td className="border p-2">
                            {course.CourseCode}
                          </td>

                          <td className="border p-2">
                            {course.CourseDesc}
                          </td>

                          <td className="border p-2 text-center">
                            {cr}
                          </td>

                          <td className="border p-2">
                            {course.Semester}
                          </td>

                        </tr>

                      );

                    })}

                    {/* TOTAL ROW */}

                    <tr className="bg-green-100 font-semibold">

                      <td colSpan="2" className="border p-2">
                        Total Courses
                      </td>

                      <td className="border p-2 text-center">
                        {uniqueCourses.length}
                      </td>

                      <td className="border p-2 text-center">
                        {totalCredits}
                      </td>

                      <td></td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default BucketCourses;