import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import moment from 'moment';

const WishWall = () => {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWishes(wishesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newWish.trim()) return;

    try {
      await addDoc(collection(db, 'wishes'), {
        content: newWish,
        name: name || 'Ẩn danh',
        timestamp: new Date(),
      });
      setNewWish('');
      setName('');
    } catch (error) {
      console.error('Error adding wish:', error);
    }
  };

  return (
    <div className="wish-container">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Bức Tường Điều Ước</h1>
        <p className="text-gray-600">Hãy chia sẻ điều ước của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="wish-card">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tên của bạn (không bắt buộc)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Viết điều ước của bạn..."
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            className="input-field h-32"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Gửi điều ước
        </button>
      </form>

      <div className="mt-8">
        {wishes.map((wish) => (
          <div key={wish.id} className="wish-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{wish.name}</h3>
                <p className="text-gray-600 mt-2">{wish.content}</p>
              </div>
              <span className="text-sm text-gray-500">
                {moment(wish.timestamp.toDate()).fromNow()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishWall; 