
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { HiOutlineRefresh } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Content from './Content';
import AddWidget from './AddWidget';

function Cnapp({ searchQuery }) {  
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleShow = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <>
      <div className='container-fluid d-flex flex-column bg-secondary-subtle'>
        <div className='row w-100 mt-4'>
          <div className='col-12 col-md-6'>
            <h5>CNAPP Dashboard</h5>
          </div>
          <div className='col-12 col-md-6 d-flex justify-content-end'>
            <div className='d-flex flex-nowrap'>
              <Button 
                className='btn btn-light me-2 mb-2 mb-md-0' 
                onClick={() => handleShow(null)}
              >
                Add Widget +
              </Button>
              <button className='btn btn-light me-2 mb-2 mb-md-0'><HiOutlineRefresh /></button>
              <button className='btn btn-light me-2 mb-2 mb-md-0'><BsThreeDotsVertical /></button>
              <button className='btn btn-light text-primary mb-2 mb-md-0'><FaClock /> Last 2 days<IoIosArrowDown /></button>
            </div>
          </div>
        </div>

        {/* Pass searchQuery to Content */}
        <Content searchQuery={searchQuery} onAddWidget={handleShow} />
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Widget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddWidget initialCategory={selectedCategory} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Cnapp;
