// Redirect if not logged in
if (!getUser()) {
    window.location.href = '/login.html';
}

// Init Quill Editor
const quill = new Quill('#quill-editor', {
    theme: 'snow',
    placeholder: 'Tell your story here...'
});

const form = document.getElementById('create-form');
const msg = document.getElementById('form-msg');
const btn = document.getElementById('submit-btn');

// Fetch Categories on Load
async function loadCategories() {
    try {
        const res = await fetch('/api/categories');
        const categories = await res.json();
        const select = document.getElementById('post-categories');
        
        select.innerHTML = ''; // Clear loading text
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.name;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error("Failed to load categories", err);
    }
}
loadCategories();

// Handle Publish
form.onsubmit = async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value;
    const fileInput = document.getElementById('post-file');
    const categorySelect = document.getElementById('post-categories');
    const content = quill.root.innerHTML;
    const user = getUser();

    if (!title || content === '<p><br></p>') {
        msg.textContent = 'Title and content are required.';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Publishing...';
    msg.textContent = '';

    try {
        let imageUrl = '';

        // 1. Upload Image if selected
        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);
            
            const uploadRes = await fetch('/api/posts/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Image upload failed');
            const uploadData = await uploadRes.json();
            imageUrl = uploadData.imageUrl;
        }

        // 2. Create Post
        const categoryIds = Array.from(categorySelect.selectedOptions).map(opt => opt.value);
        
        const postData = {
            title,
            content,
            author: user.username,
            image_url: imageUrl,
            category_ids: categoryIds
        };

        const postRes = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });

        if (postRes.ok) {
            window.location.href = '/';
        } else {
            throw new Error('Failed to create post');
        }

    } catch (err) {
        console.error(err);
        msg.textContent = err.message || 'Error occurred.';
        btn.disabled = false;
        btn.textContent = 'Publish Story';
    }
};
