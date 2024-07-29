import React, { useState, useEffect } from 'react';
import './DrinkList.css';

const DrinkList = () => {
  const [drinks, setDrinks] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('http://ec2-3-80-206-21.compute-1.amazonaws.com:8000/drinks/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Check the structure of the response
        setDrinks(data.drinks || []); // Adjust if necessary based on the actual response structure
      })
      .catch(error => console.error('Error fetching drinks:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newDrink = { name, description, price: parseInt(price, 10) };

    if (editId) {
      fetch(`http://ec2-3-80-206-21.compute-1.amazonaws.com:8000/drinks/${editId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDrink),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setDrinks(drinks.map(drink => (drink.id === editId ? data : drink)));
          setEditId(null);
          setName('');
          setDescription('');
          setPrice('');
        })
        .catch(error => console.error('Error updating drink:', error));
    } else {
      fetch('http://ec2-3-80-206-21.compute-1.amazonaws.com:8000/drinks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDrink),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setDrinks([...drinks, data]);
          setName('');
          setDescription('');
          setPrice('');
        })
        .catch(error => console.error('Error adding drink:', error));
    }
  };

  const handleEdit = (drink) => {
    setEditId(drink.id);
    setName(drink.name);
    setDescription(drink.description);
    setPrice(drink.price.toString());
  };

  const handleDelete = (id) => {
    fetch(`http://ec2-3-80-206-21.compute-1.amazonaws.com:8000/drinks/${id}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setDrinks(drinks.filter(drink => drink.id !== id));
      })
      .catch(error => console.error('Error deleting drink:', error));
  };

  return (
    <div className="container">
      <h1>Drink List</h1>
      <ul>
        {drinks.map(drink => (
          <li key={drink.id}>
            <span>{drink.name}</span>
            <span>{drink.description}</span>
            <span>${drink.price}</span>
            <button onClick={() => handleEdit(drink)}>Edit</button>
            <button onClick={() => handleDelete(drink.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>{editId ? 'Edit Drink' : 'Add a New Drink'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">{editId ? 'Update Drink' : 'Add Drink'}</button>
      </form>
    </div>
  );
};

export default DrinkList;

