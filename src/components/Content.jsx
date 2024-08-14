
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'; 
import 'react-toastify/dist/ReactToastify.css';
import AddWidgets from './AddWidgets';

function Content({ searchQuery }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [uncheckedItems, setUncheckedItems] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleShow = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = (category, itemId) => {
    const itemToDelete = data[category]?.find(item => item.id === itemId);

    if (itemToDelete && window.confirm(`Are you sure you want to delete the widget titled "${itemToDelete.title || 'Untitled'}"?`)) {
      const updatedData = {
        ...data,
        [category]: data[category].filter(item => item.id !== itemId),
      };

      fetch('http://localhost:8000/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
        .then(response => response.json())
        .then(() => {
          setData(updatedData);
          toast.success('Widget deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting widget:', error);
          toast.error('Failed to delete widget.');
        });
    }
  };

  const handleDeleteCategory = (category) => {
    if (window.confirm(`Are you sure you want to delete the entire category "${category}" and all its widgets?`)) {
      const updatedData = { ...data };
      delete updatedData[category];

      fetch('http://localhost:8000/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
        .then(response => response.json())
        .then(() => {
          setData(updatedData);
          toast.success('Category deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting category:', error);
          toast.error('Failed to delete category.');
        });
    }
  };

  const highlightText = (text) => {
    if (!searchQuery || typeof text !== 'string') return text;

    try {
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      return text.replace(regex, (match) => `${match}`);
    } catch (error) {
      console.error('Error in highlightText function:', error);
      return text;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (Object.keys(data).length === 0) {
    return <p>No data available</p>;
  }

  return (
    <>
      <div>
        {Object.keys(data).map(category => (
          <div className='container mt-4' key={category}>
            <div className='d-flex justify-content-between align-items-center'>
              <h5>{category}</h5>
              <FaTrash
                style={{ cursor: 'pointer', color: 'black' }}
                onClick={() => handleDeleteCategory(category)}
              />
            </div>
            <div className='d-flex gap-3 flex-wrap'>
              {data[category]?.filter(item => {
                const title = item?.title ? item.title.toLowerCase() : '';
                const content = item?.content ? item.content.toLowerCase() : '';

                const query = searchQuery ? searchQuery.toLowerCase() : '';

                return (
                  !uncheckedItems[category]?.has(item.id) &&
                  (title.includes(query) || content.includes(query))
                );
              }).map(item => (
                <div className='card' key={item.id} style={{ width: '400px', height: '300px' }}>
                  <div className='card-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <h5 dangerouslySetInnerHTML={{ __html: highlightText(item?.title || '') }}></h5>
                      <button
                        type="button"
                        className='btn-close'
                        aria-label="Close"
                        onClick={() => handleDelete(category, item.id)}
                      ></button>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: highlightText(item?.content || '') }}></p>
                  </div>
                </div>
              ))}
              <div className='card' style={{ width: '450px', height: '300px' }}>
                <div className='card-body d-flex align-items-center justify-content-center'>
                  <Button
                    className='btn btn-light me-2 mb-2 mb-md-0'
                    onClick={() => handleShow(category)} // Pass the category to handleShow
                  >
                    Add Widgets +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <ToastContainer />
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add Widget</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddWidgets initialCategory={selectedCategory} /> {/* Pass selectedCategory as initialCategory */}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Content;

