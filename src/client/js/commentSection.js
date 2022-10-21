
const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
    const videoComments =  document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    const icon = document.createElement("i");
    const span2 = document.createElement('span');
    icon.className = "fas fa-comment";
    newComment.className = "video__comments";
    const span = document.createElement('span');
    span.innerText = ` ${text}`;
    span2.innerText = "❌";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
}

const handleSubmit = async (event) => {
    const textarea = form.querySelector("textarea");
    event.preventDefault();
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === '') {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(
            {text}
        ),

    });

    if (response.status === 201) {
        textarea.value = '';
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
        // textarea.value 는 getter 와 setter 둘다 가능하다.
        
    }
}

if (form) {
    form.addEventListener('submit', handleSubmit);
}
