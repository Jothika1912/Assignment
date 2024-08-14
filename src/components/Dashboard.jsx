import React, { useState } from 'react';
import Cnapp from './Cnapp';
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div>
        <div className='navbar navbar-expand-lg navbar-light bg-light' style={{ maxHeight: '50px' }}>
          <div className='container-fluid'>
            <div className='row align-items-center w-100'>
              <div className='col-auto'>
                <div className='navbar-brand'>
                  <p className="mb-0 fs-6">Home - <b>Dashboard</b></p>
                </div>
              </div>

              <div className='col'>
                <div className='input-group mx-lg-3' style={{ maxWidth: '500px' }}>
                  <span className='input-group-text' id='basic-addon1'><IoSearch /></span>
                  <input
                    type='search'
                    className='form-control'
                    placeholder='Search anything..'
                    aria-label='Search'
                    aria-describedby='basic-addon1'
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              <div className='col-auto'>
                <ul className='navbar-nav'>
                  <li className='nav-item'>
                    <a className='nav-link' href='#'>
                      <CgProfile /> Login
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pass searchQuery to Cnapp */}
        <Cnapp searchQuery={searchQuery} />
      </div>
    </>
  );
}

export default Dashboard;
