import "regenerator-runtime";
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const rmBtn = document.querySelector(".video__comment button");
const commentId = document.getElementById("commentId");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComments = document.createElement("li");
  newComments.id = "commentId";
  newComments.dataset.id = id;
  newComments.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  const span2 = document.createElement("button");
  span2.id = "removeBtn";
  span.innerText = `${text}`;
  span2.innerText = "❌";
  newComments.appendChild(icon);
  newComments.appendChild(span);
  newComments.appendChild(span2);
  videoComments.prepend(newComments);
};

const handleDelete = async (event) => {
  const deleteCommentId = commentId.dataset.id;
  const li = event.target.parentElement;
  li.remove();
  await fetch(`/api/videos/${deleteCommentId}/deleteComment`, {
    method: "DELETE",
  });
  window.location.reload();
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    textarea.value = "";
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
  rmBtn.addEventListener("click", handleDelete);
}
