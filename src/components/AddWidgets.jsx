import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AddWidgets({ initialCategory }) { 
  const [data, setData] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [showWidgetInputs, setShowWidgetInputs] = useState(false);
  const [uncheckedItems, setUncheckedItems] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/data")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const handleSaveCategory = async () => {
    const updatedData = { ...data };

    // Add new category if it doesn't exist
    if (newCategory && !updatedData[newCategory]) {
      updatedData[newCategory] = [];
    }

    // Save the updated data to the server
    try {
      const response = await fetch("http://localhost:8000/data", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setData(updatedData);
        toast.success('Category added successfully!');
      } else {
        throw new Error('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category.');
    } finally {
      setNewCategory('');
    }
  };

  const handleSaveWidget = async () => {
    if (!selectedCategory) {
      toast.error('No category selected.');
      return;
    }

    // Remove unchecked items from the category
    const updatedData = { ...data };
    const categoryData = updatedData[selectedCategory] || [];

    const filteredItems = categoryData.filter(
      (item) => !uncheckedItems[selectedCategory]?.has(item.id)
    );

    updatedData[selectedCategory] = filteredItems;

    try {
      const response = await fetch("http://localhost:8000/data", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setData(updatedData);
        toast.success('Widgets removed successfully!');
      } else {
        throw new Error('Failed to save widgets');
      }
    } catch (error) {
      console.error('Error saving widgets:', error);
      toast.error('Failed to save widgets.');
    }
  };

  const handleSaveNewWidget = async () => {
    if (!selectedCategory) {
      toast.error('No category selected.');
      return;
    }

    // Validate if title and content are provided
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Please enter the title and content.');
      return;
    }

    const updatedData = { ...data };
    const categoryData = updatedData[selectedCategory] || [];
    categoryData.push({ id: Date.now(), title: newTitle, content: newContent });

    updatedData[selectedCategory] = categoryData;

    try {
      const response = await fetch("http://localhost:8000/data", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setData(updatedData);
        toast.success('New widget added successfully!');
      } else {
        throw new Error('Failed to add new widget');
      }
    } catch (error) {
      console.error('Error adding new widget:', error);
      toast.error('Failed to add new widget.');
    } finally {
      setShowWidgetInputs(false);
      setNewTitle('');
      setNewContent('');
    }
  };

  const handleCheckboxChange = (category, itemId) => {
    setUncheckedItems(prevState => {
      const categoryUnchecked = new Set(prevState[category] || []);

      if (categoryUnchecked.has(itemId)) {
        categoryUnchecked.delete(itemId);
      } else {
        categoryUnchecked.add(itemId);
      }

      return {
        ...prevState,
        [category]: categoryUnchecked
      };
    });
  };

  return (
    <div className='container'>
      <p>Personalize your dashboard by adding the following widget</p>
      {selectedCategory && (
        <div className='my-4'>
          <h5>{selectedCategory} - Category</h5>
          {data[selectedCategory] && data[selectedCategory].map(item => (
            <div key={item.id} className='d-flex align-items-center'>
              <input 
                type='checkbox' 
                className='form-check-input me-2' 
                checked={!uncheckedItems[selectedCategory]?.has(item.id)}
                onChange={() => handleCheckboxChange(selectedCategory, item.id)}
              />
              <span>{item.title}</span>
            </div>
          ))}
          <button className='btn btn-primary mt-3' onClick={handleSaveWidget}>Save Widget</button><br/>
          <button className='btn btn-outline-secondary mt-3' onClick={() => setShowWidgetInputs(true)}>
            + Add Widget
          </button>

          {showWidgetInputs && (
            <div className='d-grid gap-3 my-3'>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  className='form-control'
                  placeholder="Enter the title.."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label>Content</label>
                <input
                  type="text"
                  className='form-control'
                  placeholder="Enter the content.."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                />
              </div>
              <div className='d-flex justify-content-start gap-2'>
                <button className='btn btn-secondary' onClick={() => setShowWidgetInputs(false)}>Close</button>
                <button className='btn btn-primary' onClick={handleSaveNewWidget}>Save</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AddWidgets;
