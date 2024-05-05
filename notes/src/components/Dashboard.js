import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthData } from '../auth/AuthWrapper';
import axios from 'axios'; 
import NavigationBar from './NavigationBar'; 

import './Dashboard.css'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = AuthData();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editItem, setEditItem] = useState(null);
  const itemsPerPage = 3; 

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
        title,
        body,
        completed: false
      });
      setItems([response.data, ...items]);
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/todos/${editItem.id}`,
        {
          id: editItem.id,
          title,
          body,
          completed: editItem.completed
        }
      );
      setItems(items.map((item) => (item.id === editItem.id ? response.data : item)));
      setEditItem(null);
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setTitle(item.title);
    setBody(item.body);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="dashboard-container">
      <NavigationBar handleLogout={handleLogout} />
      <div className="dashboard-content">
        <div className="add-item-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          {editItem ? (
            <button className="update-button" onClick={handleUpdateItem}>
              Update Item
            </button>
          ) : (
            <button className="add-item-button" onClick={handleAddItem}>
              Add Item
            </button>
          )}
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="items-list">
            <ul>
              {currentItems.map((item) => (
                <li key={item.id}>
                  <div className="item">
                    <div className="item-details">
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                    <div className="item-actions">
                      <button className="edit-button" onClick={() => handleEditItem(item)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {currentPage * itemsPerPage < items.length && (
              <button className="next-button" onClick={handleNextPage}>
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
