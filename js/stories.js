"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
// TODO: check if user exists before doing the piece on 27
// TODO: lift the star generating into another function 
// Have this function determine whether or not there is a user and if so, call the star function
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const fill = currentUser.isStoryFavorite(story) ? "-fill" : "";

  return $(`
      <li id="${story.storyId}">
        <a href="#" class="favorite-button">
          <i class="bi bi-star${fill}"></i>
        </a>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Adds new story to user in the API, generates the story markup, and adds
 * to the story page
 */

async function submitNewStoryAndAddToPage(evt) {
  console.debug("Submit story", evt);
  evt.preventDefault();

  const author = $("#addstory-author").val();
  const title = $("#addstory-title").val();
  const url = $("#addstory-url").val();

  const story = await storyList.addStory(currentUser,{author, title, url})
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story).show();
  $submitForm.trigger("reset").hide();
}

$submitForm.on("submit", submitNewStoryAndAddToPage);

/** Generates the markup for the current user's favorited stories */
// TODO: putFavoriteStoriesOnPage is better name to be more in line
function generateFavoriteStoryMarkup() {
  console.debug("putFavoriteStoriesOnPage");

  $favoriteStoriesList.empty();

  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }

  $favoriteStoriesList.show();
}

/** Handles the user toggling favorites on stories
 * If the story is a favorite, it removes the favorite from the API and local data and updates UI.
 * If not, it adds the favorite from the API and local data and updates the UI.
 * 
 * evt: HTML element
 */
async function handleFavoriteToggle(evt) {
  console.debug("handleFavoriteToggle");
  const $target = $(evt.target);
  const currStoryId = $target.closest("li").attr("id");

  const currStory = await Story.getStoryById(currStoryId);
  // TODO: toggle class instead of add and remove
  if (currentUser.isStoryFavorite(currStory)) {
    $target.removeClass("bi bi-star-fill")
    $target.addClass("bi bi-star");
    await currentUser.removeFavorite(currStory);
  } else {
    $target.removeClass("bi bi-star");
    $target.addClass("bi bi-star-fill");
    await currentUser.addFavorite(currStory);
  }
}

$allStoriesList.on("click", ".favorite-button", handleFavoriteToggle);
$favoriteStoriesList.on("click", ".favorite-button", handleFavoriteToggle);

