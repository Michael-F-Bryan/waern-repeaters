import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import Repeater from './api/Repeater';

Vue.use(Vuex);

function exampleRepeaters(): Repeater[] {
  return [
    new Repeater({ latitude: -31.3828, longitude: 116.1068 }),
    new Repeater({
      latitude: -31.512,
      longitude: 116.3023,
      channel: 256,
      agency: "DFES",
      label: "DFES 258",
      location: "JULIMAR",
      address: "Optus Guyed Mast Off Julimar Road JULIMAR",
      altitude: 303,
      plan: "1st",
      mast_height: 60
    })
  ];
}

export class State {
  public repeaters: Repeater[] = exampleRepeaters();
  public token: string = "";
}

export interface RootState {
  repeaters: Repeater[];
  token: string;
}


const options: StoreOptions<RootState> = {
  state: {
    repeaters: [],
    token: "",
  },
  mutations: {
    clearRepeaters(state) {
      state.repeaters = [];
    },
    appendRepeaters(state, repeaters: Repeater[]) {
      state.repeaters.push(...repeaters);
    },
    setToken(state, token: string) {
      state.token = token;
    }
  },
};

export default new Vuex.Store<RootState>(options);