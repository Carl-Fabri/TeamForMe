import { Pipe, PipeTransform } from '@angular/core';
import { OccupancyState, occupancyState } from '../../core/models/team.model';

/**
 * Maps a team's `{ filled, capacity }` to its occupancy bucket (FR-007).
 * Pure — recomputed only when the input reference changes.
 */
@Pipe({ name: 'occupancy' })
export class OccupancyPipe implements PipeTransform {
  transform(
    team: { readonly filled: number; readonly capacity: number } | null | undefined,
  ): OccupancyState {
    if (!team) {
      return 'available';
    }
    return occupancyState(team);
  }
}
