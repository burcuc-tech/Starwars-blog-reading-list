import { useState } from "react";
import PropTypes from "prop-types";

const visualGuidePaths = {
  people: "characters",
  planets: "planets",
  vehicles: "vehicles"
};

const categorySymbols = {
  people: "JEDI",
  planets: "ORBITA",
  vehicles: "NAVE"
};

const officialImages = {
  "people-1": "https://lumiere-a.akamaihd.net/v1/images/luke-skywalker-main_7ffe21c7.jpeg?region=130%2C147%2C1417%2C796",
  "people-2": "https://lumiere-a.akamaihd.net/v1/images/c-3po-main_d6850e28.jpeg?region=176%2C0%2C951%2C536",
  "people-3": "https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_f315b094.jpeg?region=273%2C0%2C951%2C536",
  "people-4": "https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720",
  "people-5": "https://lumiere-a.akamaihd.net/v1/images/leia-organa-main_9af6ff81.jpeg?region=187%2C157%2C1400%2C786",
  "people-6": "https://lumiere-a.akamaihd.net/v1/images/owen-lars-main_08c717c8.jpeg?region=0%2C34%2C1053%2C593",
  "people-7": "https://lumiere-a.akamaihd.net/v1/images/beru-lars-main_fa680a4c.png?region=342%2C0%2C938%2C527",
  "people-8": "https://lumiere-a.akamaihd.net/v1/images/r5-d4_main_image_7d5f078e.jpeg?region=374%2C0%2C1186%2C666",
  "people-9": "https://lumiere-a.akamaihd.net/v1/images/image_606ff7f7.jpeg?region=0%2C0%2C1560%2C878",
  "people-10": "https://lumiere-a.akamaihd.net/v1/images/obi-wan-kenobi-main_3286c63c.jpeg?region=0%2C0%2C1280%2C721",
  "planets-1": "https://lumiere-a.akamaihd.net/v1/images/tatooine-main_9542b896.jpeg?region=165%2C0%2C949%2C534",
  "planets-2": "https://lumiere-a.akamaihd.net/v1/images/alderaan-main_f5b676cf.jpeg?region=0%2C0%2C1280%2C720",
  "planets-3": "https://lumiere-a.akamaihd.net/v1/images/yavin-4-main_bd23f447.jpeg?region=331%2C0%2C949%2C534",
  "planets-4": "https://lumiere-a.akamaihd.net/v1/images/Hoth_d074d307.jpeg?region=0%2C0%2C1200%2C675",
  "planets-5": "https://lumiere-a.akamaihd.net/v1/images/Dagobah_890df592.jpeg?region=0%2C80%2C1260%2C711",
  "planets-6": "https://lumiere-a.akamaihd.net/v1/images/Bespin_2d0759aa.jpeg?region=0%2C0%2C1560%2C878",
  "planets-7": "https://lumiere-a.akamaihd.net/v1/images/databank_endor_01_169_68ba9bdc.jpeg?region=0%2C0%2C1560%2C878",
  "planets-8": "https://lumiere-a.akamaihd.net/v1/images/databank_naboo_01_169_6cd7e1e0.jpeg?region=0%2C0%2C1560%2C878",
  "planets-9": "https://lumiere-a.akamaihd.net/v1/images/coruscant-main_d2fad5f2.jpeg?region=245%2C0%2C1430%2C804",
  "planets-10": "https://lumiere-a.akamaihd.net/v1/images/kamino-main_3001369e.jpeg?region=158%2C0%2C964%2C542",
  "vehicles-4": "https://lumiere-a.akamaihd.net/v1/images/sandcrawler-main_eb1b036b.jpeg?region=251%2C20%2C865%2C487",
  "vehicles-7": "https://lumiere-a.akamaihd.net/v1/images/E4D_IA_1136_6b8704fa.jpeg?region=237%2C0%2C1456%2C819",
  "vehicles-6": "https://lumiere-a.akamaihd.net/v1/images/databank_t16skyhopper_01_169_ad69e901.jpeg?region=141%2C304%2C750%2C422",
  "vehicles-8": "https://lumiere-a.akamaihd.net/v1/images/TIE-Fighter_25397c64.jpeg?region=0%2C1%2C2048%2C1152",
  "vehicles-14": "https://lumiere-a.akamaihd.net/v1/images/snowspeeder_ef2f9334.jpeg?region=0%2C211%2C2048%2C1154",
  "vehicles-18": "https://lumiere-a.akamaihd.net/v1/images/at-at-main_3449acaf.jpeg?region=0%2C26%2C1295%2C729",
  "vehicles-16": "https://lumiere-a.akamaihd.net/v1/images/tie-bomber-main_d4d9b979.jpeg?region=424%2C0%2C632%2C356",
  "vehicles-19": "https://lumiere-a.akamaihd.net/v1/images/e6d_ia_5724_a150e6d4.jpeg?region=124%2C0%2C1424%2C802",
  "vehicles-20": "https://lumiere-a.akamaihd.net/v1/images/cloud-car-main-image_8d2e4e89.jpeg?region=271%2C0%2C1009%2C568",
  "vehicles-24": "https://lumiere-a.akamaihd.net/v1/images/databank_jabbassailbarge_01_169_e3834269.jpeg?region=0%2C0%2C1560%2C878"
};

export const getImageUrl = (type, uid) => {
  return `https://starwars-visualguide.com/assets/img/${visualGuidePaths[type]}/${uid}.jpg`;
};

const getImageSources = (type, uid) => {
  return [
    `/images/${type}/${uid}.jpg`,
    officialImages[`${type}-${uid}`],
    getImageUrl(type, uid)
  ].filter(Boolean);
};

export const StarWarsImage = ({ type, uid, alt, className = "", fallbackClassName = "" }) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = getImageSources(type, uid);
  const source = sources[sourceIndex];

  if (!source) {
    return (
      <div className={`star-image-fallback ${fallbackClassName}`} role="img" aria-label={alt}>
        <span>{categorySymbols[type]}</span>
        <strong>{alt}</strong>
      </div>
    );
  }

  return (
    <img
      src={source}
      className={className}
      alt={alt}
      onError={() => setSourceIndex((currentIndex) => currentIndex + 1)}
    />
  );
};

StarWarsImage.propTypes = {
  type: PropTypes.oneOf(["people", "planets", "vehicles"]).isRequired,
  uid: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallbackClassName: PropTypes.string
};
