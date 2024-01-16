'use client'
import { useState } from 'react';
import styles from './styles.css';

export default function TDashboard() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div>
      <div className="grid grid-cols-2 p-2 rounded-xl bg-[#0d0d1f] m-6 lg:ml-20 lg:mr-20 lg:mt-10 lg:mb-10 flex flex-col justify-stretch items-center">
        <div
          className={`glows ${isHovered ? 'gradient-border' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Create New Assignment
        </div>
        
                <div className="text-2xl border border-[#564075] border-4 pt-4 pb-4 m-4 bg-[#2E2C2B] lg:mt-10 lg:mb-5 lg:ml-20 lg:mr-24 flex justify-center items-center" >Create New Classroom</div>
                <div className="text-2xl border border-[#564075] border-4 pt-4 pb-4 m-4 bg-[#2E2C2B] lg:mt-10 lg:mb-5 lg:ml-20 lg:mr-24 flex justify-center items-center" >View Past Assignment</div>
                <div className="text-2xl border border-[#564075] border-4 pt-4 pb-4 m-4 bg-[#2E2C2B] lg:mt-10 lg:mb-5 lg:ml-20 lg:mr-24 flex justify-center items-center">View Assignment</div>
                <div className="text-2xl border border-[#564075] border-4 pt-4 pb-4 m-4 bg-[#2E2C2B] lg:mt-10 lg:mb-5 lg:ml-20 lg:mr-24 flex justify-center items-center">View Student Marks</div>
      </div>
    </div>
  );
}
                // text-2xl pt-4 pb-4 m-4 bg-[#18192a] lg:mt-10 lg:mb-5 lg:ml-20 lg:mr-24 lg:pt-8 lg:pb-8 flex justify-center items-center rounded-xl
