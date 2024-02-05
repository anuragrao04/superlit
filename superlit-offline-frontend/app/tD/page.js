import './style.css';
export default function tdashboard(){
    var dashboardOptions = ["Create New Assignment", "Create New Classroom", "View Past Assignment", "View Assignment", "View Student Marks"];
    return(
        <div>
            <div className="text-4xl flex justify-center items-center m-12 ">Hello Teachers Name!</div>
            <div className="wrapper"></div>
        <div className=" grid lg:grid-cols-4 md:grid-cols-2 gap-12 mt-12">
          {dashboardOptions.map((dashboardItem, index) => (
            <div key={index}>
              <div className="card">
                <div className="border"></div>
                <div className="filter"></div>
                <div className="flex justify-center items-center text-2xl">{dashboardItem}</div>
                <div className="shadow"></div>
                <div className="backdrop"></div>
              </div>
            </div>
          ))}
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
    )
}
