export interface RouteProps {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export class Route {
  constructor(private props: RouteProps) {}

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
}