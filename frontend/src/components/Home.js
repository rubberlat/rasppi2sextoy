import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Welcome to the FastAPI + React SPA Example</h2>
      <p>This is a simple demonstration of a Single Page Application using React with a FastAPI backend.</p>
      <p>
        <Link to="/items">View Items</Link>
      </p>
    </div>
  );
}

export default Home;