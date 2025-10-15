import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchText'
})
export class SearchTextPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase().trim();

    return items.filter((score) => {
      // filtro por nombre de juego
      const gameName = score.games?.name?.toLowerCase() || '';
      if (gameName.includes(searchText)) {
        return true;
      }

      // filtro por puntuacion
      const scoreValue = String(score.score || 0).toLowerCase();
      if (scoreValue.includes(searchText)) {
        return true;
      }

      // filtro por resultado (Victoria/Derrota)
      const victoryText = (score.victory ? 'victoria' : 'derrota');
      if (victoryText.includes(searchText)) {
        return true;
      }

      // filtro por fecha
      const dateText = String(score.created_at).toLowerCase();
      if (dateText.includes(searchText)) {
        return true;
      }

      return false;
    });
  }
}
