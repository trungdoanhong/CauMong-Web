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

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase đã được kết nối thành công!");
    
    // Kiểm tra kết nối Database
    const dbRef = firebase.database().ref('wishes');
    dbRef.limitToFirst(1).once('value')
        .then(() => {
            console.log("Realtime Database hoạt động tốt!");
        })
        .catch((error) => {
            console.error("Lỗi kết nối Database:", error);
        });
} catch (error) {
    console.error("Lỗi khởi tạo Firebase:", error);
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
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            reactions: {
                heart: 0,
                haha: 0
            }
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
    
    const wishes = [];
    snapshot.forEach((childSnapshot) => {
        wishes.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });
    wishes.reverse();

    wishes.forEach((wish) => {
        const time = wish.timestamp ? new Date(wish.timestamp).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : '';
        
        // Đảm bảo reactions luôn có giá trị mặc định
        const reactions = {
            heart: 0,
            haha: 0,
            ...(wish.reactions || {}) // Spread operator để ghi đè giá trị mặc định nếu có
        };
        
        const wishElement = document.createElement('div');
        wishElement.className = 'wish-card';
        wishElement.innerHTML = `
            <div class="header">
                <div class="title-group">
                    <h3>${wish.name}</h3>
                    <div class="time">🕒 ${time}</div>
                </div>
                <div class="reactions">
                    <button class="reaction-btn heart ${reactions.heart > 0 ? 'active' : ''}" 
                        data-type="heart" data-count="${reactions.heart}">
                        ❤️ <span>${reactions.heart}</span>
                    </button>
                    <button class="reaction-btn haha ${reactions.haha > 0 ? 'active' : ''}" 
                        data-type="haha" data-count="${reactions.haha}">
                        😆 <span>${reactions.haha}</span>
                    </button>
                </div>
            </div>
            <p>${wish.content}</p>
        `;

        // Thêm event listeners cho nút reaction
        const reactionBtns = wishElement.querySelectorAll('.reaction-btn');
        reactionBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const type = btn.dataset.type;
                const currentCount = parseInt(btn.dataset.count) || 0;
                const newCount = currentCount + 1;
                
                try {
                    await wishesRef.child(wish.id).child('reactions').update({
                        [type]: newCount
                    });
                    
                    // Cập nhật UI
                    btn.dataset.count = newCount;
                    btn.querySelector('span').textContent = newCount;
                    btn.classList.add('active');
                    
                    // Thêm hiệu ứng animation
                    btn.classList.add('pop');
                    setTimeout(() => btn.classList.remove('pop'), 200);
                } catch (error) {
                    console.error('Error updating reaction:', error);
                }
            });
        });
        
        wishList.appendChild(wishElement);
    });
}, (error) => {
    console.error('Error getting wishes:', error);
}); 