/** Geographic coordinates for an event location. */
export interface GeoCoords {
  readonly lat: number;
  readonly lng: number;
}

/**
 * A hackathon event. Mirrors the future backend `MS_Events` entity.
 * `coords` may be absent — the detail view hides the map in that case (FR-004).
 */
export interface EventModel {
  readonly id: string;
  readonly name: string;
  /** ISO 8601 date or date-time string. */
  readonly date: string;
  readonly location: string;
  readonly coords?: GeoCoords;
  readonly description?: string;
  /** Optional decorative gradient token used in section headers. */
  readonly themeGradient?: string;
}
