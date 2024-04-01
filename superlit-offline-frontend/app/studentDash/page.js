"use client"
import './style.css';
import Modal from 'react-modal';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
export default function sdashboard(){
    var dashboardOptions = [["Classroom1", "2", "0","15/15"], ["Classroom2", "5", "1","15/15"]]; // ["classroom_name", "no of completed assignments", "no of due assignments", "score"]
const [showModal, setShowModal] = useState(false);
 const [code, setRandomCode] = useState('');
 const modalRef = useRef();

 useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
 }, []);

 const handleOpenModal = () => {
    setShowModal(true);
 };

 const handleCloseModal = () => {
    setShowModal(false);
 };
 
    return(
        <div>
            <div className="text-4xl flex justify-center items-center m-12 lg:mb-24 ">Hello Students Name!</div>
            <div className="wrapper"></div>
        <div className=" grid lg:grid-cols-3 md:grid-cols-2 gap-12 z-0">
          {dashboardOptions.map((dashboardItem, index) => (
            <div key={index}>
              <div className="card h-96 w-96">
                <div className="border"></div>
                <div className="filter"></div>
                <div className="text-4xl mb-4">{dashboardItem[0]}</div>
                <div className="flex flex-col content-start">
                  <div className="text-xl m-1">Completed Assignments: {dashboardItem[1]}</div>
                  <div className="text-xl m-1">Due Assignments: {dashboardItem[2]}</div>
                  <div className="text-white">Click to see scores</div>
                </div>
                <div className="shadow"></div>
                <div className="backdrop"></div>
              </div>
            </div>
          ))}
          <div className="joinClassroom" onClick={handleOpenModal}>
              <div className="card h-96 w-96">
                <div className="border"></div>
                <div className="filter"></div>
                <div className="text-6xl">+</div>
                <div className="shadow"></div>
                <div className="backdrop"></div>
              </div>
          </div>
        </div>
 <Modal isOpen={showModal} onRequestClose={handleCloseModal} ariaHideApp={false} className="bg-background grid lg:m-24 justify-items-center overflow-hidden">
          
   <div ref={modalRef}>
        <label className="m-6 flex">
            Enter your code:
            <input
              type="text"
              value={code}
              onChange={e => setRandomCode(e.target.value)}
            />
          </label>
        <button className="" onClick={handleCloseModal}>Close</button>
        </div>
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
    )
}
