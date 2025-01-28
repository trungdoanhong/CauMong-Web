// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9-p8s-7iAAurl61jixIITs4G1dtzxwYI",
    authDomain: "caumong-com.firebaseapp.com",
    projectId: "caumong-com",
    storageBucket: "caumong-com.firebasestorage.app",
    messagingSenderId: "1074032671065",
    appId: "1:1074032671065:web:e0f31c68abffb0fe59b448",
    measurementId: "G-Q01T11BSNR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const wishForm = document.getElementById('wishForm');
const wishList = document.getElementById('wishList');

// Add new wish
wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const wishInput = document.getElementById('wish');
    
    const name = nameInput.value.trim() || 'Ẩn danh';
    const wish = wishInput.value.trim();
    
    if (!wish) return;

    try {
        await db.collection('wishes').add({
            name: name,
            content: wish,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        nameInput.value = '';
        wishInput.value = '';
    } catch (error) {
        console.error('Error adding wish:', error);
        alert('Có lỗi xảy ra khi gửi điều ước. Vui lòng thử lại!');
    }
});

// Real-time wishes update
db.collection('wishes')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
        wishList.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const wish = doc.data();
            const time = wish.timestamp ? new Date(wish.timestamp.toDate()).toLocaleString('vi-VN') : '';
            
            const wishElement = document.createElement('div');
            wishElement.className = 'wish-card';
            wishElement.innerHTML = `
                <h3>${wish.name}</h3>
                <p>${wish.content}</p>
                <div class="time">${time}</div>
            `;
            
            wishList.appendChild(wishElement);
        });
    }, (error) => {
        console.error('Error getting wishes:', error);
    }); 