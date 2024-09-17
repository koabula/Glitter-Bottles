// // 检查是否有 MetaMask 或其他钱包扩展
// async function connectWallet() {
//     if (typeof window.ethereum !== 'undefined') {
//         try {
//             // 请求账户授权
//             const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
//             const account = accounts[0];
//             document.getElementById("wallet-address").innerText = account;
//             document.getElementById("connect-button").style.display = "none";
//             document.getElementById("disconnect-button").style.display = "inline";
//             // 设置隐藏字段的值为钱包地址
//             document.getElementById("wallet-address-input").value = account;
//         } catch (error) {
//             console.error('User rejected the request', error);
//         }
//     } else {
//         alert('Please install MetaMask or another wallet!');
//     }
// }

// // 断开连接
// function disconnectWallet() {
//     document.getElementById("wallet-address").innerText = "Not Connected";
//     document.getElementById("connect-button").style.display = "inline";
//     document.getElementById("disconnect-button").style.display = "none";
// }

// // 监听钱包地址变化
// if (window.ethereum) {
//     window.ethereum.on('accountsChanged', function (accounts) {
//         document.getElementById("wallet-address").innerText = accounts[0] || "Not Connected";
//         if (accounts.length === 0) {
//             disconnectWallet();
//         }
//     });
// }

// // 绑定按钮事件
// document.getElementById('connect-button').addEventListener('click', connectWallet);
// document.getElementById('disconnect-button').addEventListener('click', disconnectWallet);

// 检查是否有 MetaMask 或其他钱包扩展
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 请求账户授权
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            // 保存钱包地址到本地存储
            localStorage.setItem('walletAddress', account);

            document.getElementById("wallet-address").innerText = account;
            document.getElementById("connect-button").style.display = "none";
            document.getElementById("disconnect-button").style.display = "inline";
            
            // 设置隐藏字段的值为钱包地址
            document.getElementById("wallet-address-input").value = account;
        } catch (error) {
            console.error('User rejected the request', error);
        }
    } else {
        alert('Please install MetaMask or another wallet!');
    }
}

// 断开连接
function disconnectWallet() {
    // 清除本地存储中的钱包地址
    localStorage.removeItem('walletAddress');

    document.getElementById("wallet-address").innerText = "Not Connected";
    document.getElementById("connect-button").style.display = "inline";
    document.getElementById("disconnect-button").style.display = "none";
    
    // 清空隐藏字段的值
    document.getElementById("wallet-address-input").value = "";
}

// 监听页面加载时设置钱包状态
window.addEventListener('load', () => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
        document.getElementById("wallet-address").innerText = savedAddress;
        document.getElementById("connect-button").style.display = "none";
        document.getElementById("disconnect-button").style.display = "inline";
        document.getElementById("wallet-address-input").value = savedAddress;
    }
});

// 监听钱包地址变化
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            disconnectWallet();
        } else {
            // 更新本地存储中的钱包地址
            const account = accounts[0];
            localStorage.setItem('walletAddress', account);
            
            document.getElementById("wallet-address").innerText = account;
            document.getElementById("connect-button").style.display = "none";
            document.getElementById("disconnect-button").style.display = "inline";
            document.getElementById("wallet-address-input").value = account;
        }
    });
}

// 绑定按钮事件
document.getElementById('connect-button').addEventListener('click', connectWallet);
document.getElementById('disconnect-button').addEventListener('click', disconnectWallet);


function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    clockElement.textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock(); // 初始化时钟

function addPost() {
    const postInput = document.getElementById('postInput');
    const postList = document.getElementById('postList');

    if (postInput.value.trim() !== '') {
        const newPost = document.createElement('div');
        newPost.className = 'post';

        // 创建帖子图片元素
        const postImage = document.createElement('img');
        postImage.src = 'https://via.placeholder.com/100'; // 占位图片，后续可替换为用户上传的图片

        // 创建帖子内容区域
        const postContent = document.createElement('div');
        postContent.className = 'post-content';
        postContent.textContent = postInput.value;

        // 将图片和内容添加到帖子中
        newPost.appendChild(postImage);
        newPost.appendChild(postContent);

        postList.appendChild(newPost);
        postInput.value = ''; // 清空输入框
    } else {
        alert('请输入帖子内容');
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const postContents = document.querySelectorAll(".post-content");

    postContents.forEach(function (content) {
        const text = content.textContent;
        if (text.length > 100) {
            const truncated = text.substring(0, 100) + "...";
            content.textContent = truncated;
        }
    });
});


// Function to set wallet address in the hidden input field
function setWalletAddress(address) {
    document.getElementById('wallet-address-input').value = address;
}

// Simulated wallet connection (Replace with actual wallet connection logic)
document.getElementById('connect-button').addEventListener('click', function () {
    // Example wallet address
    const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';
    document.getElementById('wallet-address').textContent = walletAddress;
    setWalletAddress(walletAddress);
    document.getElementById('disconnect-button').style.display = 'inline';
});

document.getElementById('disconnect-button').addEventListener('click', function () {
    document.getElementById('wallet-address').textContent = 'Not Connected';
    setWalletAddress('');
    document.getElementById('disconnect-button').style.display = 'none';
});