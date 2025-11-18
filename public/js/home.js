async function loadPosts() {
    const container = document.getElementById('feed-container');
    const currentUser = getUser();

    try {
        const res = await fetch(`/api/posts?t=${Date.now()}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        
        const posts = await res.json();
        container.innerHTML = '';

        if (posts.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:2rem;">No stories yet. Be the first to write one!</div>';
            return;
        }

        posts.forEach(post => {
            const date = new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
            });

            // Plain Text Preview (Strip HTML)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const preview = plainText.length > 200 ? plainText.substring(0, 200) + "..." : plainText;

            const imageHtml = post.image_url 
                ? `<img src="${post.image_url}" class="post-img" alt="${post.title}">` 
                : '';

            // Make the whole card clickable or add a button
            const html = `
                <article class="post-card">
                    ${imageHtml}
                    <div class="post-content">
                        <div class="post-meta">By ${post.author || 'Anonymous'} • ${date}</div>
                        <h2 class="post-title">
                            <a href="/post.html?id=${post.id}" style="text-decoration:none; color:inherit: hover:text-decoration:underline;">
                                ${post.title}
                            </a>
                        </h2>
                        <div class="post-body">${preview}</div>
                        <a href="/post.html?id=${post.id}" class="btn btn-outline" style="display:inline-block; margin-top:0.5rem;">Read Story →</a>
                    </div>
                </article>
            `;
            container.innerHTML += html;
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p style="color:red; text-align:center;">Error loading posts: ${err.message}</p>`;
    }
}

loadPosts();
