// cheng000.github.io/docs/.vitepress/components/encrypt/generate-hash.js
const bcrypt = require('bcryptjs');

const password = 'icbccd'; // 替换为你的新密码 icbccd
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error generating hash:', err);
    } else {
        console.log('Generated hash:', hash);
    }
});


// node generate-hash.js 运行后得到hash加密后的密码