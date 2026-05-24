import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StarWarsImage } from "../components/StarWarsImage";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { databankDescriptions } from "../data/databankDescriptions";

const API_BASE_URL = "https://www.swapi.tech/api";

const categoryLabels = {
  people: "Personaje",
  planets: "Planeta",
  vehicles: "Vehículo"
};

const infoTitles = {
  people: "Detalles",
  planets: "Detalles",
  vehicles: "Detalles"
};

const hiddenFields = new Set(["created", "edited", "url"]);

const fieldLabels = {
  birth_year: "Nacimiento",
  cargo_capacity: "Capacidad de carga",
  climate: "Clima",
  consumables: "Consumibles",
  cost_in_credits: "Costo",
  crew: "Tripulación",
  diameter: "Diámetro",
  eye_color: "Color de ojos",
  films: "Apariciones",
  gender: "Género",
  gravity: "Gravedad",
  hair_color: "Color de pelo",
  height: "Altura",
  homeworld: "Origen",
  length: "Longitud",
  manufacturer: "Fabricante",
  mass: "Masa",
  max_atmosphering_speed: "Velocidad máxima",
  model: "Modelo",
  name: "Nombre",
  orbital_period: "Periodo orbital",
  passengers: "Pasajeros",
  pilots: "Pilotos",
  population: "Población",
  residents: "Residentes",
  rotation_period: "Periodo de rotación",
  skin_color: "Color de piel",
  starships: "Naves",
  surface_water: "Agua superficial",
  terrain: "Terreno",
  vehicle_class: "Clase",
  vehicles: "Vehículos"
};

const formatLabel = (key) => {
  return fieldLabels[key] || key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const isSwapiUrl = (value) => {
  return typeof value === "string" && value.startsWith("https://www.swapi.tech/api/");
};

const getRelatedUrls = (properties) => {
  return [...new Set(
    Object.values(properties)
      .flat()
      .filter(isSwapiUrl)
  )];
};

const renderValue = (value, relatedValues) => {
  if (Array.isArray(value)) {
    if (!value.length) {
      return "Sin registros";
    }

    return (
      <div className="related-list">
        {value.map((item) => (
          <span className="related-pill" key={item}>
            {isSwapiUrl(item) ? relatedValues[item] || "Cargando..." : item}
          </span>
        ))}
      </div>
    );
  }

  if (isSwapiUrl(value)) {
    return relatedValues[value] || "Cargando...";
  }

  return value || "Desconocido";
};

export const Single = () => {
  const { type, uid } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [entity, setEntity] = useState(null);
  const [relatedValues, setRelatedValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntity = async () => {
      setLoading(true);
      setError(null);
      setRelatedValues({});

      try {
        const response = await fetch(`${API_BASE_URL}/${type}/${uid}`);

        if (!response.ok) {
          throw new Error("No se pudo cargar el detalle solicitado.");
        }

        const data = await response.json();
        setEntity(data.result);

        const relatedEntries = await Promise.all(
          getRelatedUrls(data.result.properties).map(async (url) => {
            try {
              const relatedResponse = await fetch(url);
              const relatedData = await relatedResponse.json();
              const title = relatedData.result?.properties?.title || relatedData.result?.properties?.name;

              return [url, title || "Recurso relacionado"];
            } catch {
              return [url, "Recurso relacionado"];
            }
          })
        );

        setRelatedValues(Object.fromEntries(relatedEntries));
      } catch (currentError) {
        setError(currentError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [type, uid]);

  const properties = entity?.properties || {};
  const name = properties.name || "Detalle";
  const description = databankDescriptions[`${type}-${uid}`] || entity?.description;
  const isFavorite = store.favorites.some(
    (favorite) => favorite.uid === uid && favorite.type === type
  );

  const handleFavorite = () => {
    dispatch({
      type: "toggle_favorite",
      payload: {
        uid,
        name,
        type
      }
    });
  };

  return (
    <main className="detail-page">
      <div className="container py-4">
        <div className="detail-actions">
          <Link to="/" className="btn btn-outline-light">
            Volver al inicio
          </Link>
        </div>

        {loading && (
          <div className="alert alert-info" role="status">
            Cargando detalle...
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {entity && (
          <div className="row g-4 align-items-stretch detail-shell">
            <div className="col-12 col-lg-6">
              <StarWarsImage
                type={type}
                uid={uid}
                className="img-fluid detail-image"
                alt={name}
                fallbackClassName="detail-image"
              />
            </div>
            <div className="col-12 col-lg-6 detail-info-column">
              <div className="detail-header">
                <div>
                  <span className="badge text-bg-warning text-dark mb-3">{categoryLabels[type]}</span>
                  <h1>{name}</h1>
                </div>
                <button
                  className="btn btn-lg btn-warning detail-favorite-button"
                  type="button"
                  onClick={handleFavorite}
                >
                  {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                </button>
                <p className="detail-description">{description}</p>
              </div>

              <div className="databank-details">
                <h2>{infoTitles[type]}</h2>
                <div className="databank-detail-list">
                  {Object.entries(properties)
                    .filter(([key]) => !hiddenFields.has(key))
                    .map(([key, value]) => (
                      <div className="databank-detail-item" key={key}>
                        <div className="databank-detail-label">{formatLabel(key)}</div>
                        <div className="databank-detail-value">
                          {renderValue(value, relatedValues)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
