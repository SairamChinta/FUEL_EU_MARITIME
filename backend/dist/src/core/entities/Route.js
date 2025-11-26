"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
class Route {
    props;
    constructor(props) {
        this.props = props;
    }
    get routeId() { return this.props.routeId; }
    get vesselType() { return this.props.vesselType; }
    get fuelType() { return this.props.fuelType; }
    get year() { return this.props.year; }
    get ghgIntensity() { return this.props.ghgIntensity; }
    get fuelConsumption() { return this.props.fuelConsumption; }
    get distance() { return this.props.distance; }
    get totalEmissions() { return this.props.totalEmissions; }
    get isBaseline() { return this.props.isBaseline; }
    setAsBaseline() {
        this.props.isBaseline = true;
    }
    toJSON() {
        return {
            routeId: this.routeId,
            vesselType: this.vesselType,
            fuelType: this.fuelType,
            year: this.year,
            ghgIntensity: this.ghgIntensity,
            fuelConsumption: this.fuelConsumption,
            distance: this.distance,
            totalEmissions: this.totalEmissions,
            isBaseline: this.isBaseline
        };
    }
}
exports.Route = Route;
