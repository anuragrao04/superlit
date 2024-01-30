export default function ViewClassroom() {
 var classArray = [["3-A","28-Jan-2024","02-Feb-2024"],["3-B","28-Jan-2024","02-Feb-2024"],["3-C","28-Jan-2024","02-Feb-2024"]];

 return (
    <div className="classroom bg-[#0F0913]">
      <button className="text-white rounded-full text-sm px-5 py-2.5 text-center mb-2 bg-ring-purple-900 ">Add Another Classroom </button>
      <div className="grid grid-cols-3 m-24 p-2 rounded-xl justify-center items-center bg-[#0F0913] ">
        {classArray.map((classItem, index) => (
          <div key={index}>
            <div className="flex flex-col p-4 justify-center m-16 rounded-2xl text-2xl gap-x-12 gap-y-6"  
                 style={{ 
                    background: `linear-gradient(
      to top,
      rgba(117, 117, 239, 0.5) 0%,
      rgba(0, 0, 0, 0.5) 92.3%)`,
                    backdropFilter: 'blur(5px)'
                 }}>
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
