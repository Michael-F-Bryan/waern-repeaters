<template>
  <b-container>
    <b-row align-h="center">
      <b-col>
        <b-table :items="repeaters" :fields="fields" :sort-compare="sortCompare"></b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

class Repeater {
  latitude: number = 0;
  longitude: number = 0;
  channel?: number;
  plan?: string;
  agency?: string;
  label?: string;
  location?: string;
  address?: string;
  altitude?: number;
  mast_height?: number;

  constructor(options: Partial<Repeater>) {
    Object.assign(this, options);
  }
}

interface PropField {
  key: keyof Repeater;
  label?: string;
  sortable?: boolean;
}

interface CalculatedField {
  key: string;
  label?: string;
  sortable?: boolean;
  formatter: keyof RepeaterTable;
}

type Field = PropField | CalculatedField;

interface Coordinate {
  latitude: number;
  longitude: number;
}

function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversine(
  first: Coordinate,
  second: Coordinate,
  radius: number = 6371e3
): number {
  const φ1 = radians(first.latitude);
  const φ2 = radians(second.latitude);
  const Δφ = radians(second.latitude - first.latitude);
  const Δλ = radians(second.longitude - first.longitude);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}

function bearing(first: Coordinate, second: Coordinate): number {
  var y =
    Math.sin(second.longitude - first.longitude) * Math.cos(second.latitude);
  var x =
    Math.cos(first.latitude) * Math.sin(second.latitude) -
    Math.sin(first.latitude) *
      Math.cos(second.latitude) *
      Math.cos(second.longitude - first.longitude);
  return Math.atan2(y, x);
}

function toString(value: any): string {
  if (!value) {
    return "";
  } else if (value instanceof Object) {
    return Object.keys(value)
      .sort()
      .map(key => toString(value[key]))
      .join(" ");
  }
  return String(value);
}

@Component
export default class RepeaterTable extends Vue {
  public latitude: number = -31.3811;
  public longitude: number = 116.1711;
  public fields: Field[] = [
    { key: "latitude", sortable: true },
    { key: "longitude", sortable: true },
    {
      key: "range",
      label: "Range (km)",
      sortable: true,
      formatter: "calculateRange"
    },
    { key: "bearing", sortable: true, formatter: "calculateBearing" },
    { key: "channel", sortable: true },
    { key: "plan", sortable: true },
    { key: "agency", sortable: true },
    { key: "label", sortable: true },
    { key: "location", sortable: false },
    { key: "address", sortable: false },
    { key: "altitude", sortable: true },
    { key: "mast_height", sortable: true }
  ];
  public allRepeaters: Repeater[] = [
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
      mast_height: 60
    })
  ];

  public calculateRange(value: any, key: string, item: Repeater): string {
    const distance = haversine(this, item) / 1000;
    const rounded = Math.round(distance * 10) / 10;
    return rounded.toString();
  }

  public calculateBearing(value: any, key: string, item: Repeater): string {
    let bearingAngle = (bearing(this, item) * 180) / Math.PI;

    if (bearingAngle < 0) {
      bearingAngle += 360;
    }
    const rounded = Math.round(bearingAngle * 10) / 10;
    return rounded.toString();
  }

  public get repeaters(): Repeater[] {
    // TODO: Apply filters and stuff
    return this.allRepeaters;
  }

  sortCompare(a: any, b: any, key: string): number {
    // see https://github.com/bootstrap-vue/bootstrap-vue/issues/3178
    const compare = (l: number, r: number) => (l < r ? -1 : l > r ? 1 : 0);

    if (key == "range" && a instanceof Repeater && b instanceof Repeater) {
      const d1 = haversine(this, a);
      const d2 = haversine(this, b);
      return compare(d1, d2);
    } else if (
      key == "bearing" &&
      a instanceof Repeater &&
      b instanceof Repeater
    ) {
      const b1 = bearing(this, a);
      const b2 = bearing(this, b);
      return compare(b1, b2);
    } else if (typeof a[key] === "number" && typeof b[key] === "number") {
      // If both compared fields are native numbers
      return compare(a[key], b[key]);
    } else {
      // Stringify the field data and use String.localeCompare
      return toString(a[key]).localeCompare(toString(b[key]), undefined, {
        numeric: true
      });
    }
  }
}
</script>