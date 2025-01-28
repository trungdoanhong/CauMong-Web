// Firebase configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
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