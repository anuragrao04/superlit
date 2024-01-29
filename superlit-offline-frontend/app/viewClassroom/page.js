export default function ViewClassroom() {
 var classArray = [["3-A","28-Jan-2024","02-Feb-2024"],["3-B","28-Jan-2024","02-Feb-2024"],["3-C","28-Jan-2024","02-Feb-2024"],["Class 4","28-Jan-2024","02-Feb-2024"],["Class 5","28-Jan-2024","02-Feb-2024"],["Class 6","28-Jan-2024","02-Feb-2024"],["Class 7","28-Jan-2024","02-Feb-2024"],["Class 8","28-Jan-2024","02-Feb-2024"],["Class 9","28-Jan-2024","02-Feb-2024"],["Class 10","28-Jan-2024","02-Feb-2024"],["Class 11","28-Jan-2024","02-Feb-2024"],["Class 12","28-Jan-2024","02-Feb-2024"]];

 return (
    <div className="classroom">
      <div className="m-6 p-5">Add Another Classroom </div>
      <div className="grid grid-cols-3 m-2 p-2 rounded-xl justify-center items-center">
        {classArray.map((classItem, index) => (
          <div key={index}>
            <div className="flex flex-col border border-white p-5 m-6 rounded-2xl gap-x-24 gap-y-8 text-2xl bg-primary bg-opacity-5">
            <div className="flex justify-center items-center text-3xl">{classItem[0]}</div>
            <div>Assigned On:{classItem[1]}</div>
            <div>Due On:{classItem[2]}</div>
          </div>
          </div>
        ))}
        <div className="flex flex-col justify-center items-center border border-white p-5 m-6 text-2xl">Class1<div className=" text-lg">Assignment Set: </div><div className=" text-lg">Due On: </div><div className=" text-lg">No. of submissions: </div></div>
      </div>
    </div>
 );
}
