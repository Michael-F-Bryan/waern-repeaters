<template>
  <b-container>
    <b-row align-h="center">
      <b-col>
        <b-table :items="repeaters" :fields="filtered" :sort-compare="sortCompare"></b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Repeater from "@/api/Repeater";
import { haversine, bearing, sortCompare, cmp, Coordinate } from "@/api/utils";

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
      mast_height: 60
    })
  ];
}

function validator(thing: any): thing is Repeater[] {
  return (
    thing &&
    thing instanceof Array &&
    thing.every(elem => elem instanceof Repeater)
  );
}

type Predicate<T> = (item: T) => boolean;

@Component
export default class RepeaterTable extends Vue {
  public latitude: number = -31.3811;
  public longitude: number = 116.1711;
  public maximumDistance: number = Infinity;
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
  @Prop({ required: true, validator })
  public repeaters!: Repeater[];

  public calculateRange(value: any, key: string, item: Repeater): number {
    const distance = haversine(this, item) / 1000;
    return Math.round(distance * 10) / 10;
  }

  public calculateBearing(value: any, key: string, item: Repeater): string {
    let bearingAngle = (bearing(this, item) * 180) / Math.PI;

    if (bearingAngle < 0) {
      bearingAngle += 360;
    }
    const rounded = Math.round(bearingAngle * 10) / 10;
    return rounded.toString();
  }

  public get filtered(): Repeater[] {
    const isHappy = (it: Repeater) => this.conditions.every(c => c(it));

    return this.repeaters.filter(isHappy);
  }

  private get conditions(): Predicate<Coordinate>[] {
    return [item => haversine(this, item) < this.maximumDistance];
  }

  sortCompare(a: any, b: any, key: string): number {
    if (key == "range" && a instanceof Repeater && b instanceof Repeater) {
      const d1 = haversine(this, a);
      const d2 = haversine(this, b);
      return cmp(d1, d2);
    } else if (
      key == "bearing" &&
      a instanceof Repeater &&
      b instanceof Repeater
    ) {
      const b1 = bearing(this, a);
      const b2 = bearing(this, b);
      return cmp(b1, b2);
    } else {
      return sortCompare(a, b, key);
    }
  }
}
</script>