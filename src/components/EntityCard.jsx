import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { StarWarsImage } from "./StarWarsImage";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { databankDescriptions } from "../data/databankDescriptions";

const categoryLabels = {
  people: "Personaje",
  planets: "Planeta",
  vehicles: "Vehículo"
};

const defaultDescriptions = {
  people: "Perfil del personaje con datos de la SWAPI y acceso a su ficha completa.",
  planets: "Mundo de la galaxia con clima, terreno, población y otros detalles.",
  vehicles: "Vehículo de Star Wars con modelo, fabricante y características técnicas."
};

const getCardDescription = (item, type) => {
  const customDescription = databankDescriptions[`${type}-${item.uid}`];

  if (customDescription) {
    return customDescription;
  }

  if (item.description) {
    return item.description;
  }

  const properties = item.properties || {};

  if (type === "people") {
    const height = properties.height && properties.height !== "unknown" ? `${properties.height} cm` : null;
    const birthYear = properties.birth_year && properties.birth_year !== "unknown" ? properties.birth_year : null;
    const gender = properties.gender && properties.gender !== "n/a" ? properties.gender : null;

    return [height, birthYear, gender].filter(Boolean).join(" · ") || defaultDescriptions.people;
  }

  if (type === "planets") {
    const climate = properties.climate && properties.climate !== "unknown" ? properties.climate : null;
    const terrain = properties.terrain && properties.terrain !== "unknown" ? properties.terrain : null;
    const population = properties.population && properties.population !== "unknown"
      ? `Población ${properties.population}`
      : null;

    return [climate, terrain, population].filter(Boolean).join(" · ") || defaultDescriptions.planets;
  }

  if (type === "vehicles") {
    const model = properties.model && properties.model !== "unknown" ? properties.model : null;
    const vehicleClass = properties.vehicle_class && properties.vehicle_class !== "unknown" ? properties.vehicle_class : null;
    const manufacturer = properties.manufacturer && properties.manufacturer !== "unknown" ? properties.manufacturer : null;

    return [model, vehicleClass, manufacturer].filter(Boolean).join(" · ") || defaultDescriptions.vehicles;
  }

  return item.description || defaultDescriptions[type];
};

export const EntityCard = ({ item, type }) => {
  const { store, dispatch } = useGlobalReducer();
  const isFavorite = store.favorites.some(
    (favorite) => favorite.uid === item.uid && favorite.type === type
  );
  const description = getCardDescription(item, type);

  const handleFavorite = () => {
    dispatch({
      type: "toggle_favorite",
      payload: {
        uid: item.uid,
        name: item.name,
        type
      }
    });
  };

  return (
    <div className="card star-card h-100">
      <div className="star-card-media">
        <StarWarsImage
          type={type}
          uid={item.uid}
          className="card-img-top star-card-image"
          alt={item.name}
          fallbackClassName="star-card-image"
        />
        <span className="media-badge">{categoryLabels[type]}</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text star-card-description">{description}</p>
        <div className="d-flex justify-content-between align-items-center gap-2 mt-auto">
          <Link to={`/details/${type}/${item.uid}`} className="btn btn-dark">
            Ver detalles
          </Link>
          <button
            className={`btn favorite-button ${isFavorite ? "is-active" : ""}`}
            type="button"
            onClick={handleFavorite}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <i className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

EntityCard.propTypes = {
  item: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    properties: PropTypes.shape({
      description: PropTypes.string
    })
  }).isRequired,
  type: PropTypes.oneOf(["people", "planets", "vehicles"]).isRequired
};
