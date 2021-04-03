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

fetchUserAlbumList(1).then(function (albumList) {
  console.log(albumList);
});

// fetchUserAlbumList(1).then(renderAlbumList);

$("#user-list").on("click", ".user-card .load-posts", function () {
  let userInfo = $(this).closest(".user-card").data("user");
  console.log(userInfo);
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
  // post.comments might be undefined, or an []
  // if undefined, fetch them then set the result
  // if defined, return a rejected promise
}

bootstrap();
