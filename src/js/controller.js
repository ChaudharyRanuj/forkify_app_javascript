import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import resultsView from './views/resultsView.js';

// https://forkify-api.herokuapp.com/v2 ///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // Load Spinner before Loading Recipe
    if (!id) return;
    
    recipeView.renderSpinner();
    // 0 update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Load Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchRecipe = async function () {
  try {
    ResultsView.renderSpinner();
    // 1) Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2) Load Search results
    await model.loadSearchResults(query);

    // 3) Render Result
    ResultsView.render(model.getSearchResultsPage(6));

    // 4) Render inital pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render Result
  ResultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render inital pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  model.addBookmark(model.state.recipe);
  
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchRecipe);
  paginationView._addHandlerClick(controlPagination);
};

init();
