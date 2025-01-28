import React, { useEffect } from 'react';
import WishWall from './components/WishWall';

function App() {
  useEffect(() => {
    // Cập nhật title và meta description
    document.title = "Bức Tường Điều Ước";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Nơi gửi gắm những điều ước và lời chúc của bạn");
    }
  }, []);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <WishWall />
    </div>
  );
}

export default App; 