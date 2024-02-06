"use client";
import './style.css';
import Modal from 'react-modal';
import {useState} from 'react';
export default function ViewClassroom() {
 var classArray = [["3-A","Week-2","28-Jan-2024","02-Feb-2024"],["3-B","Week-4","28-Jan-2024","02-Feb-2024"]]
 const [semesterNo, setSemesterNo] = useState('');
 const [section, setSection] = useState('');
 const [subject, setSubject] = useState('');
 const [showForm, setShowForm] = useState(false);
const [showModal, setShowModal] = useState(true);
 const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ semesterNo, section, subject });
    setSemesterNo('');
    setSection('');
    setSubject('');
 };
 return (
 <div>
 <div className="container">
        <div className="lg:text-6xl md:text-4xl text-3xl m-12">Your Classrooms</div>
        <div className=" grid lg:grid-cols-3 md:grid-cols-2 gap-12">
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
          <div class="addClassroom"onclick={() => setshowmodal(true)}>
              <div className="card">
                <div className="border"></div>
                <div className="filter"></div>
                <div className="text-6xl">+</div>
                <div className="shadow"></div>
                <div className="backdrop"></div>
              </div>
          </div>
      </div> 
      </div>
      <Modal isOpen={true} ariaHideApp={false}>
        <form onSubmit={handleSubmit}>
          <label>
            Semester No:
            <input
              type="number"
              value={semesterNo}
              onChange={e => setSemesterNo(e.target.value)}
            />
          </label>
          <br />
          <label>
            Section:
            <input
              type="text"
              value={section}
              onChange={e => setSection(e.target.value)}
            />
          </label>
          <br />
          <label>
            Subject:
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </label>
          <br />
          <button type="submit" onclick={()=> setShowModal(false)}>Submit</button>
        </form>
      </Modal>
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

