export default function ViewClassroom() {
 var classArray = [["3-A","28-Jan-2024","02-Feb-2024"],["3-B","28-Jan-2024","02-Feb-2024"],["3-C","28-Jan-2024","02-Feb-2024"]];

 return (
    <div className="classroom bg-[#1F1C30] min-h-screen">
      <button className="text-white rounded-full text-sm px-5 py-2.5 text-center mb-2 bg-ring-purple-900 ">Add Another Classroom </button>
      <div className="grid grid-cols-3 m-24 p-2 rounded-xl justify-center items-center">
        {classArray.map((classItem, index) => (
          <div key={index}>
            <div className="flex flex-col p-4 justify-center m-16 rounded-2xl text-2xl gap-x-12 gap-y-6 bg-[#28273F]"  
                 style={{ backdropFilter: `blur(5px)` }}>
            <div className="flex justify-center items-center">{classItem[0]}</div>
            <div className="text-base ml-8">Assigned On:{classItem[1]}</div>
            <div className="text-base ml-8 mb-4">Due On:{classItem[2]}</div>
          </div>
          </div>
        ))}
      </div>
    </div>
 );
}
