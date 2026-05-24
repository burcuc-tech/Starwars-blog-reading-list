import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const categoryLabels = {
  people: "Personaje",
  planets: "Planeta",
  vehicles: "Vehículo"
};

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchQuery = searchTerm.trim().toLowerCase();
  const searchableItems = ["people", "planets", "vehicles"].flatMap((type) =>
    store[type].map((item) => ({
      ...item,
      type
    }))
  );
  const searchResults = searchQuery.length < 2
    ? []
    : searchableItems
        .filter((item) => item.name.toLowerCase().includes(searchQuery))
        .slice(0, 6);

  const closeSearch = () => {
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  return (
    <nav className="navbar navbar-expand navbar-galaxy" data-bs-theme="dark">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand fw-bold">
          Blog de Star Wars
        </Link>
        <div className="search-dropdown">
          <label className="visually-hidden" htmlFor="databank-search">
            Buscar en la databank
          </label>
          <input
            id="databank-search"
            className="form-control search-input"
            type="search"
            placeholder="Buscar..."
            value={searchTerm}
            autoComplete="off"
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
          />
          {isSearchOpen && searchQuery.length >= 2 && (
            <div className="search-menu">
              {searchResults.length === 0 && (
                <div className="search-empty">Sin resultados</div>
              )}

              {searchResults.map((item) => (
                <Link
                  className="search-result"
                  key={`${item.type}-${item.uid}`}
                  to={`/details/${item.type}/${item.uid}`}
                  onClick={closeSearch}
                >
                  <span className="fw-semibold">{item.name}</span>
                  <span className="d-block small">{categoryLabels[item.type]}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="favorites-dropdown ms-auto">
          <button
            className="btn btn-warning fw-semibold favorites-toggle"
            type="button"
            aria-expanded={isFavoritesOpen}
            aria-haspopup="true"
            onClick={() => setIsFavoritesOpen((current) => !current)}
          >
            Favoritos <span className="badge text-bg-dark ms-1">{store.favorites.length}</span>
          </button>
          <div className={`favorites-menu ${isFavoritesOpen ? "is-open" : ""}`}>
            {store.favorites.length === 0 && (
              <div className="favorite-empty text-secondary py-3">No hay favoritos todavía</div>
            )}

            {store.favorites.map((favorite) => (
              <div key={`${favorite.type}-${favorite.uid}`} className="favorite-item">
                <div className="favorite-link">
                  <span className="fw-semibold">{favorite.name}</span>
                  <span className="d-block small text-secondary">{categoryLabels[favorite.type]}</span>
                </div>
                <button
                  className="favorite-remove-button"
                  type="button"
                  aria-label={`Eliminar ${favorite.name} de favoritos`}
                  onClick={() =>
                    dispatch({
                      type: "toggle_favorite",
                      payload: favorite
                    })
                  }
                >
                  <i className="fa-solid fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
