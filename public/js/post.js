async function loadSinglePost() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const container = document.getElementById('single-post-container');
    const currentUser = getUser();

    if (!postId) {
        window.location.href = '/';
        return;
    }

    try {
        // Fetch all posts and find the one we need
        // (Since the backend doesn't have a specific "Get One" route yet, this is the easiest frontend fix)
        const res = await fetch(`/api/posts?t=${Date.now()}`);
        if (!res.ok) throw new Error('Failed to load story');
        
        const posts = await res.json();
        const post = posts.find(p => p.id == postId);

        if (!post) {
            container.innerHTML = '<h2 style="text-align:center">Story not found</h2>';
            return;
        }

        // Format Date
        const date = new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });

        // Actions (Delete)
        let actionsHtml = '';
        if (currentUser) { // In a real app, check if currentUser.username === post.author
            actionsHtml = `
                <div style="margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem;">
                    <button class="btn btn-danger" onclick="deletePost(${post.id})">Delete Story</button>
                </div>`;
        }

        // Render Full Content
        container.innerHTML = `
            <article style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                ${post.image_url ? `<img src="${post.image_url}" style="width:100%; max-height:400px; object-fit:cover; border-radius:8px; margin-bottom:1.5rem;">` : ''}
                
                <div style="margin-bottom: 1rem; color: #666;">
                    <span>By <strong>${post.author || 'Anonymous'}</strong></span> • <span>${date}</span>
                </div>

                <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem; line-height: 1.2;">${post.title}</h1>
                
                <div class="post-body" style="font-size: 1.1rem; line-height: 1.8;">
                    ${post.content} 
                </div>

                ${actionsHtml}
            </article>
        `;

    } catch (err) {
        container.innerHTML = `<p style="color:red; text-align:center;">Error: ${err.message}</p>`;
    }
}

// Reuse delete logic
async function deletePost(id) {
    if(!confirm("Delete this story?")) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    window.location.href = '/';
}

loadSinglePost();
