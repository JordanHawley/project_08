const BASE_URL = "https://jsonplace-univclone.herokuapp.com";

function fetchUsers() {
  const url = `${BASE_URL}/users`;
  return fetchData(url);
}

function renderUser(user) {
  let userCard = $(`<div class="user-card">
        <header>
            <h2>${user.name}</h2>
        </header>
        <section class="company-info">
            <p><b>Contact:</b> ${user.email}</p>
            <p><b>Works for:</b> ${user.company.name}</p>
            <p><b>Company creed:</b> "${user.company.catchPhrase}"</p>
        </section>
        <footer>
            <button class="load-posts">POSTS BY ${user.username}</button>
            <button class="load-albums">ALBUMS BY ${user.username}</button>
        </footer>
        </div>
        `);

  userCard.data("user", user);

  return userCard;
}

function renderUserList(userList) {
  $("#user-list").empty();
  userList.forEach(function (id) {
    $("#user-list").append(renderUser(id));
  });
}

function bootstrap() {
  fetchUsers().then(renderUserList);
}

/* get an album list, or an array of albums */
function fetchUserAlbumList(userId) {
  const url = `${BASE_URL}/users/${userId}/albums?_expand=user&_embed=photos`;

  return fetchData(url);
}

/* render a single album */
function renderAlbum(album) {
  //   $(".album-card").append(".photo-list").empty();
  const albumElement = $(`<div class="album-card">
  <header>
    <h3>${album.title}, by ${album.username}</h3>
  </header>
  <section class="photo-list">
    <div class="photo-card"></div>
    <div class="photo-card"></div>
    <div class="photo-card"></div>
  </section>
</div>
`).find(".photo-list");

  album.photos.forEach(function (photo) {
    albumElement.append(renderPhoto(photo));
  });

  return albumElement;
}

/* render a single photo */
function renderPhoto(photo) {
  return $(`<div class="photo-card">
  <a href="${photo.url}" target="_blank">
    <img src="${photo.thumbnailUrl}" />
    <figure>${photo.title}</figure>
  </a>
</div>`);
}

/* render an array of albums */
function renderAlbumList(albumList) {
  $("#app section.active").removeClass("active");
  $("#album-list").empty().addClass("active");
  albumList.forEach(function (album) {
    $("#album-list").append(renderAlbum(album));
  });
}

function fetchData(url) {
  return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error;
    });
}

// fetchUserAlbumList(1).then(function (albumList) {
//   console.log(albumList);
// });

// fetchUserAlbumList(1).then(renderAlbumList);

$("#user-list").on("click", ".user-card .load-posts", function () {
  let userInfo = $(this).closest(".user-card").data("user");
  fetchUserPosts(userInfo.id).then(function (postList) {
    renderPostList(postList);
  });
  //render posts for this user
});

$("#user-list").on("click", ".user-card .load-albums", function () {
  let userInfo = $(this).closest(".user-card").data("user");
  fetchUserAlbumList(userInfo.id).then(function (albumList) {
    renderAlbumList(albumList);
  });
  // render albums for this user
});

function fetchUserPosts(userId) {
  return fetchData(`${BASE_URL}/users/${userId}/posts?_expand=user`);
}

function fetchPostComments(postId) {
  return fetchData(`${BASE_URL}/posts/${postId}/comments`);
}

function setCommentsOnPost(post) {
  // if we already have comments, don't fetch them again
  if (post.comments) {
    return Promise.reject(null);
  }

  // fetch, upgrade the post object, then return it
  return fetchPostComments(post.id).then(function (comments) {
    post.comments = comments;
    return post;
  });
}

function renderPost(post) {
  return $(`<div class="post-card">
  <header>
    <h3>${post.title}</h3>
    <h3>--- ${post.user.username}</h3>
  </header>
  <p>${post.body}</p>
  <footer>
    <div class="comment-list"></div>
    <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
  </footer>
</div>`).data('post', post)
}

function renderPostList(postList) {
  $("#app section.active").removeClass("active");
  $("#post-list").addClass("active");
  postList.forEach(function (post) {
    $("#post-list").append(renderPost(post));
  });
}

function toggleComments(postCardElement) {
  const footerElement = postCardElement.find("footer");

  if (footerElement.hasClass("comments-open")) {
    footerElement.removeClass("comments-open");
    footerElement.find(".verb").text("show");
  } else {
    footerElement.addClass("comments-open");
    footerElement.find(".verb").text("hide");
  }
}

$("#post-list").on("click", ".post-card .toggle-comments", function () {
  const postCardElement = $(this).closest(".post-card");
  const post = postCardElement.data("post");
  const commentListElement = postCardElement.find('.comment-list')

  // console.log(postCardElement)

  setCommentsOnPost(post)
    .then(function (post) {
      commentListElement.empty();
      post.comments.forEach(function (comment) {
        commentListElement.append(
          $(`<h3>${comment.body} ${comment.email}</h3>`)
        );
      });
      toggleComments(postCardElement);
      // return renderPostList(post);
    })
    .catch(function () {
      toggleComments(postCardElement);
    });
});

// setCommentsOnPost(somePost)
//   .then(function (post) {
//     // render & show the comments
//     return renderPostList(post)
//   })
//   .catch(function (error) {
//     // just show or hide the already rendered comments
//     toggleComments()
//   });

// fetchUserPosts(1).then(console.log); // why does this work?  Wait, what?

// fetchPostComments(1).then(console.log); // again, I'm freaking out here! What gives!?

bootstrap();
