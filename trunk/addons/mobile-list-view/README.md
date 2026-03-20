# Booking Activities - Mobile List View Addon

Cet addon ajoute une vue `Liste` hebdomadaire (`listWeek`) au calendrier Booking Activities.

## Ce que fait l'addon

- Ajoute un bouton `Liste` dans la barre d'outils FullCalendar.
- Affiche les événements en liste séparée par jour (natif `listWeek`).
- Sur mobile, bascule par défaut sur la vue `Liste`.
- Conserve la navigation semaine par semaine (`prev/next/today`).

## Installation

1. Activer le plugin principal **Booking Activities**.
2. Activer le plugin **Booking Activities - Mobile List View Addon** (`booking-activities-mobile-list-view-addon.php`).

## Hooks de personnalisation

- `bookacti_mobile_list_view_breakpoint` (int, défaut `768`)
- `bookacti_mobile_list_view_force_mobile_list` (int 0/1, défaut `1`)
- `bookacti_mobile_list_view_button_text` (string, défaut `List`)

Exemple:

```php
add_filter( 'bookacti_mobile_list_view_breakpoint', function() { return 900; } );
add_filter( 'bookacti_mobile_list_view_button_text', function() { return 'Liste'; } );
```
