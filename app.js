// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9-p8s-7iAAurl61jixIITs4G1dtzxwYI",
    authDomain: "caumong-com.firebaseapp.com",
    projectId: "caumong-com",
    storageBucket: "caumong-com.firebasestorage.app",
    messagingSenderId: "1074032671065",
    appId: "1:1074032671065:web:e0f31c68abffb0fe59b448",
    measurementId: "G-Q01T11BSNR",
    databaseURL: "https://caumong-com-default-rtdb.asia-southeast1.firebasedatabase.app"
};

console.log("Bắt đầu khởi tạo Firebase...");

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase đã được khởi tạo!");
    
    // Kiểm tra kết nối Database
    console.log("Đang kiểm tra kết nối đến Realtime Database...");
    const dbRef = firebase.database().ref('wishes');
    dbRef.limitToFirst(1).once('value')
        .then(() => {
            console.log("✅ Realtime Database hoạt động tốt!");
        })
        .catch((error) => {
            console.error("❌ Lỗi kết nối Database:", error);
            alert("Không thể kết nối đến database. Vui lòng thử lại sau!");
        });
} catch (error) {
    console.error("❌ Lỗi khởi tạo Firebase:", error);
    alert("Không thể khởi tạo Firebase. Vui lòng thử lại sau!");
}

// Kiểm tra xem firebase có được load không
if (typeof firebase === 'undefined') {
    console.error("❌ Firebase SDK chưa được load!");
} else {
    console.log("✅ Firebase SDK đã được load!");
}

const db = firebase.database();
const wishesRef = db.ref('wishes');

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
        await wishesRef.push({
            name: name,
            content: wish,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        nameInput.value = '';
        wishInput.value = '';
    } catch (error) {
        console.error('Error adding wish:', error);
        alert('Có lỗi xảy ra khi gửi điều ước. Vui lòng thử lại!');
    }
});

// Real-time wishes update
wishesRef.orderByChild('timestamp').limitToLast(50).on('value', (snapshot) => {
    wishList.innerHTML = '';
    
    // Convert to array and reverse to show newest first
    const wishes = [];
    snapshot.forEach((childSnapshot) => {
        wishes.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });
    wishes.reverse();

    wishes.forEach((wish) => {
        const time = wish.timestamp ? new Date(wish.timestamp).toLocaleString('vi-VN') : '';
        
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