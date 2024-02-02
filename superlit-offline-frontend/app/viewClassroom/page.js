import './style.css';
export default function ViewClassroom() {
 var classArray = [["3-A","Week-2","28-Jan-2024","02-Feb-2024"],["3-B","Week-4","28-Jan-2024","02-Feb-2024"],["3-C","Week-5","28-Jan-2024","02-Feb-2024"],["3-D","Week-3","01-Feb-2024","02-Feb-2024"],["3-E","Week-6","03-Feb-2024","04-Feb-2024"],["3-F","Week-7","03-Feb-2024","04-Feb-2024"],["3-G","Week-8","03-Feb-2024","04-Feb-2024"]];

 return (
 <div>
 <div className="container">
        <div className="text-6xl m-12">Your Classrooms</div>
        <div className=" grid grid-cols-3 gap-12">
          {classArray.map((classItem, index) => (
            <div key={index}>
              <div className="card">
                <div className="border"></div>
                <div className="filter"></div>
                <div className="text-4xl">{classItem[0]}</div>
                <div className="text-2xl m-3">{classItem[1]}</div>
                <div>Assigned On: {classItem[2]}</div>
                <div>Due on: {classItem[3]}</div>
                <div className="shadow"></div>
                <div className="backdrop"></div>
              </div>
            </div>
          ))}
        </div>
      </div>  
<div className="circle one"></div>
<div className="circle two"></div>
<svg>
  <filter id='noiseFilter'>
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency='0.6' 
      stitchTiles='stitch'/>
  </filter>
</svg>
</div>
  );
}

