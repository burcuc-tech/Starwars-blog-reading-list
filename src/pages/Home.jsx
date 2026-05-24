import { useEffect, useRef } from "react";
import { EntityCard } from "../components/EntityCard";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const API_BASE_URL = "https://www.swapi.tech/api";

const sections = [
  {
    key: "people",
    title: "Personajes",
    endpoint: "people"
  },
  {
    key: "planets",
    title: "Planetas",
    endpoint: "planets"
  },
  {
    key: "vehicles",
    title: "Vehículos",
    endpoint: "vehicles"
  }
];

const getItemDetails = async (item) => {
  try {
    const response = await fetch(item.url);

    if (!response.ok) {
      return item;
    }

    const data = await response.json();

    return {
      ...item,
      description: data.result?.description,
      properties: data.result?.properties
    };
  } catch {
    return item;
  }
};

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const hasRequestedData = useRef(false);
  const hasData = sections.every((section) => store[section.key].length > 0);

  useEffect(() => {
    const fetchResources = async () => {
      dispatch({ type: "set_loading", payload: true });
      dispatch({ type: "set_error", payload: null });

      try {
        const responses = await Promise.all(
          sections.map((section) =>
            fetch(`${API_BASE_URL}/${section.endpoint}?limit=12`).then((response) => {
              if (!response.ok) {
                throw new Error("No se pudieron cargar los datos de Star Wars.");
              }
              return response.json();
            })
          )
        );

        const categories = await Promise.all(
          responses.map(async (data) => {
            const items = data.results || [];
            return Promise.all(items.map(getItemDetails));
          })
        );

        categories.forEach((items, index) => {
          dispatch({
            type: "set_category",
            payload: {
              category: sections[index].key,
              items
            }
          });
        });
      } catch (error) {
        dispatch({ type: "set_error", payload: error.message });
      } finally {
        dispatch({ type: "set_loading", payload: false });
      }
    };

    if (!hasData && !hasRequestedData.current) {
      hasRequestedData.current = true;
      fetchResources();
    }
  }, [dispatch, hasData]);

  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12">
              <p className="eyebrow mb-3">Databank</p>
              <h1 className="hero-title">Star Wars</h1>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="#personajes" className="databank-tab">
                  Personajes
                </a>
                <a href="#planetas" className="databank-tab">
                  Planetas
                </a>
                <a href="#vehículos" className="databank-tab">
                  Vehículos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container content-shell">
        {store.loading && (
          <div className="alert alert-info" role="status">
            Cargando datos de la galaxia...
          </div>
        )}

        {store.error && (
          <div className="alert alert-danger" role="alert">
            {store.error}
          </div>
        )}

        {sections.map((section) => (
          <section className="resource-section" id={section.title.toLowerCase()} key={section.key}>
            <div className="section-heading">
              <div>
                <p className="section-kicker">Databank</p>
                <h2>{section.title}</h2>
              </div>
              <span>{store[section.key].length} elementos</span>
            </div>
            <div className="row g-4">
              {store[section.key].map((item) => (
                <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={`${section.key}-${item.uid}`}>
                  <EntityCard item={item} type={section.key} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};
