import { useEffect, useState } from "react";

function BucketCourses() {

  const [courses, setCourses] = useState([]);
  const [credits, setCredits] = useState([]);
  const [counsellor, setCounsellor] = useState(null);

  const [uid, setUid] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [student, setStudent] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

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

      const studentData = {
        id: result[0]["University ID"],
        name: result[0]["Name"]
      };

      setStudent(studentData);

      // 🔥 Fetch counsellor from JSON
      fetch("/Students_Counsellors.json")
        .then(res => res.json())
        .then(data => {
          const match = data.find(
            (item) => item.universityId === String(studentData.id)
          );
          setCounsellor(match || null);
        });

    } else {
      setStudent(null);
      setCounsellor(null);
    }

  };

  // CREDIT MAP (FIXED)
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

  // SUMMARY DATA
  const summaryData = Object.keys(grouped).map(bucket => {

    const rows = grouped[bucket];

    const uniqueMap = new Map();

    rows.forEach(course => {
      const code = course.CourseCode?.trim().toUpperCase();
      if (!uniqueMap.has(code)) {
        uniqueMap.set(code, course);
      }
    });

    const uniqueCourses = Array.from(uniqueMap.values());

    const totalCredits = uniqueCourses.reduce((sum, course) => {
      const code = course.CourseCode?.trim().toUpperCase();
      return sum + (creditMap[code] || 0);
    }, 0);

    return {
      bucket,
      totalCourses: uniqueCourses.length,
      totalCredits
    };

  });

  const totalBuckets = summaryData.length;

  const totalCoursesAll = summaryData.reduce(
    (sum, b) => sum + b.totalCourses, 0
  );

  const totalCreditsAll = summaryData.reduce(
    (sum, b) => sum + b.totalCredits, 0
  );

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
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          />

          <button
            onClick={handleSearch}
            className="text-white px-4 py-2 rounded"
            style={{ backgroundColor: "oklch(78.9% 0.154 211.53)" }}
          >
            Search
          </button>

        </div>

      </div>

      {/* STUDENT + SUMMARY */}
      {student && (

        <div className="flex justify-center gap-6 mb-8">

          {/* STUDENT */}
          <div className="bg-lime-100 border border-gray-200 shadow-md rounded-xl p-5 w-80">

            <p className="text-lg">
              <span className="font-bold">University ID:</span> {student.id}
            </p>

            <p className="text-lg">
              <span className="font-bold">Name:</span> {student.name}
            </p>

            {/* Counsellor Details */}
            {counsellor ? (
              <div className="mt-3 border-t pt-3 space-y-1">

                <p className="text-lg">
                  <span className="font-bold">Counsellor:</span> {counsellor.counsellorName}
                </p>

                <p className="text-lg">
                  <span className="font-bold">Emp ID:</span> {counsellor.counsellorEmpId}
                </p>

              </div>
            ) : (
              <p className="text-sm text-red-500 mt-2">
                Counsellor Not Assigned
              </p>
            )}

          </div>

          {/* SUMMARY BOX */}
          <div className="bg-cyan-300 border shadow rounded p-4 w-80">

            <p><b>Total Buckets:</b> {totalBuckets}</p>
            <p><b>Total Courses:</b> {totalCoursesAll}</p>
            <p><b>Total Credits:</b> {totalCreditsAll}</p>

            <button
              onClick={() => setShowSummary(!showSummary)}
              className="mt-3 text-white px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 transition"
            >
              {showSummary ? "Hide Summary" : "View Summary"}
            </button>

          </div>

        </div>

      )}

      {/* SUMMARY TABLE */}
      {showSummary && (

        <div className="mb-8 bg-white shadow p-4 rounded">

          <h2 className="text-lg font-bold mb-4 text-center">
            Bucket Summary
          </h2>

          <table className="w-full border text-sm">

            <thead className="bg-cyan-300">

              <tr>
                <th className="border p-2">S.No</th>
                <th className="border p-2">Bucket</th>
                <th className="border p-2">Total Courses</th>
                <th className="border p-2">Total Credits</th>
              </tr>

            </thead>

            <tbody>

              {summaryData.map((b, i) => (

                <tr key={i}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{b.bucket}</td>
                  <td className="border p-2 text-center">{b.totalCourses}</td>
                  <td className="border p-2 text-center">{b.totalCredits}</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* GRID CARDS (RESTORED FULL DETAILS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {Object.keys(grouped).map((bucket, index) => {

          const rows = grouped[bucket];

          const uniqueMap = new Map();

          rows.forEach(course => {
            const code = course.CourseCode?.trim().toUpperCase();
            if (!uniqueMap.has(code)) {
              uniqueMap.set(code, course);
            }
          });

          const uniqueCourses = Array.from(uniqueMap.values());

          const totalCredits = uniqueCourses.reduce((sum, course) => {
            const code = course.CourseCode?.trim().toUpperCase();
            return sum + (creditMap[code] || 0);
          }, 0);

          return (

            <div key={index} className="bg-white shadow rounded-lg print-card">

              {/* HEADER */}
              <div
                className="text-black px-4 py-2 font-bold flex justify-between"
                style={{ backgroundColor: "oklch(78.9% 0.154 211.53)" }}
              >
                <div>{bucket}</div>

                <div className="text-xs text-right">
                  <div>Courses: {uniqueCourses.length}</div>
                  <div>Credits: {totalCredits}</div>
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

                          <td className="border p-2 text-center">{i + 1}</td>
                          <td className="border p-2">{code}</td>
                          <td className="border p-2">{course.CourseDesc}</td>
                          <td className="border p-2 text-center">{cr}</td>
                          <td className="border p-2">{course.Semester}</td>
                          <td className="border p-2">{course.AcademicYear || "-"}</td>

                        </tr>

                      );

                    })}

                    {/* ✅ RESTORED TOTAL ROW */}
                    <tr className="bg-green-100 font-semibold">

                      <td colSpan="2" className="border p-2 text-center">
                        Total
                      </td>

                      <td className="border p-2 text-center">
                        {uniqueCourses.length}
                      </td>

                      <td className="border p-2 text-center">
                        {totalCredits}
                      </td>

                      <td className="border p-2"></td>
                      <td className="border p-2"></td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          );

        })}

      </div>

      {/* PRINT BUTTON */}
      {filtered.length > 0 && (

        <div className="text-center mt-6">

          <button
            onClick={() => window.print()}
            className="text-white px-6 py-3 rounded"
            style={{ backgroundColor: "oklch(78.9% 0.154 211.53)" }}
          >
            Print / Download PDF
          </button>

        </div>

      )}

    </div>

  );

}

export default BucketCourses;