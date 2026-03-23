import { useEffect, useState } from "react";

function BucketCourses() {

  const [courses, setCourses] = useState([]);
  const [credits, setCredits] = useState([]);

  const [uid, setUid] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {

    fetch("/registeredcourses.json")
      .then(res => res.json())
      .then(data => setCourses(data));

    fetch("/y22-courses-credits.json")
      .then(res => res.json())
      .then(data => setCredits(data));

  }, []);

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

  // ✅ FIXED CREDIT MAP
  const creditMap = Object.fromEntries(
    credits.map(c => [
      String(c["COURSE CODE"]).trim().toUpperCase(),
      Number(c.CR)
    ])
  );

  // GROUPING
  const grouped = {};

  filtered.forEach(row => {

    const bucket = row["Bucket Group"] || "Others";

    if (!grouped[bucket]) grouped[bucket] = [];

    grouped[bucket].push(row);

  });

  return (

    <div className="w-[90%] mx-auto">

      {/* TITLE */}
      <div className="text-center mb-8">

        <h1 className="text-3xl font-bold">
          Y22 Batch Student Registered Courses
        </h1>

        <p className="text-gray-600">
          Up to IV Year – II Semester
        </p>

      </div>

      {/* SEARCH */}
      <div className="flex justify-center mb-8">

        <div className="bg-white shadow p-4 rounded flex gap-3">

          <input
            type="text"
            placeholder="Enter University ID"
            className="border p-2 rounded w-64"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==="Enter") handleSearch(); }}
          />

          <button
            onClick={handleSearch}
            className="text-white px-4 py-2 rounded"
            style={{ backgroundColor:"oklch(78.9% 0.154 211.53)" }}
          >
            Search
          </button>

        </div>

      </div>

      {/* STUDENT */}
      {student && (

        <div className="flex justify-center mb-8">

          <div className="bg-gray-100 shadow rounded p-4 w-96 text-center">

            <p><b>University ID:</b> {student.id}</p>
            <p><b>Name:</b> {student.name}</p>

          </div>

        </div>

      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {Object.keys(grouped).map(bucket => {

          const rows = grouped[bucket];

          const uniqueMap = new Map();

          rows.forEach(course => {
            const code = course.CourseCode?.trim().toUpperCase();
            if (!uniqueMap.has(code)) {
              uniqueMap.set(code, course);
            }
          });

          const uniqueCourses = Array.from(uniqueMap.values());

          // ✅ FIXED TOTAL CREDITS
          const totalCredits = uniqueCourses.reduce((sum, course) => {
            const code = course.CourseCode?.trim().toUpperCase();
            return sum + (creditMap[code] || 0);
          }, 0);

          return (

            <div key={bucket} className="bg-white shadow rounded-lg print-card">

              {/* HEADER */}
              <div
                className="text-white px-4 py-2 font-bold flex justify-between items-center"
                style={{ backgroundColor:"oklch(78.9% 0.154 211.53)" }}
              >

                <div>{bucket}</div>

                <div className="text-xs text-right space-y-1">

                  <div className="bg-white/20 px-2 py-1 rounded">
                    Courses: {uniqueCourses.length}
                  </div>

                  <div className="bg-white/20 px-2 py-1 rounded">
                    Credits: {totalCredits}
                  </div>

                </div>

              </div>

              {/* TABLE */}
              <div className="p-3 max-h-[350px] overflow-y-auto print-full">

                <table className="w-full text-sm border">

                  <thead className="bg-gray-200 sticky top-0">

                    <tr>
                      <th className="border p-2">SNo</th>
                      <th className="border p-2">Code</th>
                      <th className="border p-2">Title</th>
                      <th className="border p-2">CR</th>
                      <th className="border p-2">Sem</th>
                      <th className="border p-2">AcademicYear</th>
                    </tr>

                  </thead>

                  <tbody>

                    {uniqueCourses.map((course, i) => {

                      const code = course.CourseCode?.trim().toUpperCase();
                      const cr = creditMap[code] || 0;

                      return (

                        <tr key={i}>

                          <td className="border p-2 text-center">{i+1}</td>
                          <td className="border p-2">{code}</td>
                          <td className="border p-2">{course.CourseDesc}</td>
                          <td className="border p-2 text-center">{cr}</td>
                          <td className="border p-2">{course.Semester}</td>
                          <td className="border p-2">{course.AcademicYear || "-"}</td>

                        </tr>

                      );

                    })}

                    <tr className="bg-green-100 font-semibold">

                      <td colSpan="2">Total</td>
                      <td>{uniqueCourses.length}</td>
                      <td>{totalCredits}</td>
                      <td></td>
                      <td></td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          );

        })}

      </div>

      {/* PRINT */}
      {filtered.length > 0 && (

        <div className="text-center mt-6">

          <button
            onClick={()=>window.print()}
            className="text-white px-6 py-3 rounded"
            style={{ backgroundColor:"oklch(78.9% 0.154 211.53)" }}
          >
            Print / Download PDF
          </button>

        </div>

      )}

    </div>

  );

}

export default BucketCourses;