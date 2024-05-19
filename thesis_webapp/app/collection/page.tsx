// app/blog/page.tsx
import React from 'react';
import NavBar from '../Components/NavBar/NavBar'

const Collection: React.FC = () => {
  return (
    <div>
        <NavBar></NavBar>
      <h1>Collection</h1>
      <p>Welcome to our Collection Page!</p>
    </div>
  );
};

export default Collection;
