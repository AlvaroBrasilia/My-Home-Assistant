const Wallpaper = {
  viewDiv: null,
  hass: null,
  entityId: null,

  timeOfDay: () => {
    if (!Wallpaper.hass) {
      return 'evening'
    }

    const entity = Wallpaper.hass.states[Wallpaper.entityId]
    const {
      state,
      attributes: {
        next_dawn,
        next_dusk,
        next_midnight,
        next_noon,
        next_rising,
        next_setting
      }
    } = entity

    const nextAmanhecer = new Date(next_dawn); // amanhecer
    const nextNascerDoSol = new Date(next_rising); // nascer do sol
    const nextMeioDia = new Date(next_noon); // meio-dia solar
    const nextPorDoSol = new Date(next_setting); // pôr do sol
    const nextCrepusculo = new Date(next_dusk); // crepúsculo
    const nextMidnight = new Date(next_midnight); // meia noite

    const now = new Date();

    let timeOfDay = 'night';

    if (nextNascerDoSol > nextPorDoSol) {
      if (nextNascerDoSol < now) {
        timeOfDay = 'morning';
      } else {
        timeOfDay = 'afternoon';
      }
    } else {
      if (nextCrepusculo < now) {
        timeOfDay = 'evening';
      } else {
        timeOfDay = 'night';
      }
    }
    //console.log(now, nextNascerDoSol < now)
    return timeOfDay
  },

  refresh: () => {
    // Wallpaper.viewDiv.style.background = `linear-gradient( rgba(0,0,0,.5), rgba(0,0,0,.5) ), url("/local/wallpapers/${Wallpaper.timeOfDay()}.png") fixed center bottom/cover`;
    Wallpaper.viewDiv.style.background = `url("/local/wallpapers/${Wallpaper.timeOfDay()}.png") fixed center / cover no-repeat`;
    //Wallpaper.viewDiv.style.marginTop = '0px';
    window.dispatchEvent(new Event('resize'))
  }
}

const docRoot = document.querySelector('home-assistant').shadowRoot;
const main = docRoot.querySelector('home-assistant-main').shadowRoot;
const viewDiv = main.querySelector('ha-panel-lovelace').shadowRoot.querySelector('hui-root').shadowRoot.querySelector('ha-app-layout').querySelector('[id="view"]');
// const viewDiv = main.querySelector('ha-panel-lovelace').shadowRoot.querySelector('hui-root').shadowRoot.querySelector('ha-app-layout').querySelector('hui-view');

Wallpaper.viewDiv = viewDiv

setInterval(Wallpaper.refresh, 100)

//console.log(Wallpaper.timeOfDay(), Wallpaper.viewDiv);
class DynamicWallpaper extends HTMLElement {
  set hass(hass) {
    Wallpaper.hass = hass
    Wallpaper.entityId = this.config.entity
    Wallpaper.refresh()
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 0;
  }
}

customElements.define('dynamic-wallpaper', DynamicWallpaper);
