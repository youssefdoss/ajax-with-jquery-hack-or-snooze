"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navUserFunc.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user log out, update the navbar and story page to reflect that. */

function updateNavOnLogout() {
  console.debug("updateNavOnLogout");
  $navLogin.show();
  $navLogOut.hide();
  $navUserProfile.text(`${currentUser.username}`).hide();
  putStoriesOnPage();
  $navUserFunc.hide();
}

$navLogOut.on("click", updateNavOnLogout);

/** When a user clicks submit link go to addstory form*/

function navSubmitClick() {
  console.debug("navSubmitClick");
  $(".main-nav-links").show();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

/** When a user clicks favorites, go to favorites page */

function navFavoritesClick() {
  console.debug("navFavoritesClick");
  hidePageComponents();
  generateFavoriteStoryMarkup();
  $(".main-nav-links").show();
  $favoriteStoriesList.show();
}

$navFavorites.on("click", navFavoritesClick);



