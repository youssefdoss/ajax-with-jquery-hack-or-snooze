"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/** TODO: */

function isStoryFavorite(story) {
  return currentUser.favorites.includes(story);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        <a href="#" class="favorite-button">
          <i class="bi bi-star"></i>
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

/** TODO: */

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

/** TODO: */

function generateFavoriteStoryMarkup() {
  console.debug("putFavoriteStoriesOnPage");

  $favoriteStoriesList.empty();

  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }
}

/** TODO: */
async function handleFavoriteToggle(evt) {
  console.debug("handleFavoriteToggle");
  const $target = $(evt.target);
  const currStoryId = $target.closest("li").attr("id");
  console.log(currStoryId);
  const currStory = await Story.getStoryById(currStoryId);
  console.log(currStory);

  if (isStoryFavorite(currStory)) {
    $target.toggleClass("bi bi-star");
    await currentUser.removeFavorite(currStory);
  } else {
    $target.toggleClass("bi bi-star-filled");
    await currentUser.addFavorite(currStory);
  }
}

$allStoriesList.on("click", ".favorite-button", handleFavoriteToggle);

