const RESOURCES_CACHE_VERSION = 3;

export const initialStore = () => {
  let savedFavorites = [];
  let savedResources = {};

  try {
    savedFavorites = JSON.parse(localStorage.getItem("starWarsFavorites") || "[]");
  } catch {
    savedFavorites = [];
  }

  try {
    savedResources = JSON.parse(localStorage.getItem("starWarsResources") || "{}");
  } catch {
    savedResources = {};
  }

  if (savedResources.version !== RESOURCES_CACHE_VERSION) {
    savedResources = {};
  }

  return {
    people: savedResources.people || [],
    planets: savedResources.planets || [],
    vehicles: savedResources.vehicles || [],
    favorites: savedFavorites,
    loading: false,
    error: null
  };
};

export { RESOURCES_CACHE_VERSION };

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_loading":
      return {
        ...store,
        loading: action.payload
      };

    case "set_error":
      return {
        ...store,
        error: action.payload
      };

    case "set_category":
      return {
        ...store,
        [action.payload.category]: action.payload.items
      };

    case "toggle_favorite": {
      const favorite = action.payload;
      const exists = store.favorites.some(
        (item) => String(item.uid) === String(favorite.uid) && item.type === favorite.type
      );

      return {
        ...store,
        favorites: exists
          ? store.favorites.filter(
              (item) => !(String(item.uid) === String(favorite.uid) && item.type === favorite.type)
            )
          : [...store.favorites, favorite]
      };
    }

    default:
      return store;
  }
}
