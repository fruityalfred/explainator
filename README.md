# Explainator - User Manual

This document provides a comprehensive guide to using the Explainator web application.

---

## Benutzerhandbuch (Deutsch)

#### 1. Einführung
Explainator ist eine webbasierte Anwendung zur Erstellung und Bearbeitung visueller Layouts. Sie unterstützt:
- **Organigramme** (Hierarchische Strukturen, z. B. Firmenorganisationen).
- **Office-Maps** (Raumpläne oder Bürolayouts).
- **Kanban-Boards** (Aufgabenverwaltung mit Spalten).
- **Weitere Canvas-basierte Inhalte** (z. B. benutzerdefinierte Boards).

Die App ist multilingual (Deutsch und Englisch) und bietet eine intuitive Drag-and-Drop-Oberfläche. Sie lädt keine externen Ressourcen (außer potenziell Benutzerbilder) und speichert Daten lokal oder als JSON-Dateien. Die HTML-Struktur deutet auf eine Single-Page-Application (SPA) hin, mit Modals für Dialoge und einer Haupt-Canvas-Area.

**Systemvoraussetzungen**:
- Moderner Webbrowser (z. B. Chrome, Firefox).
- Keine Internetverbindung erforderlich (außer für lokale Datei-Uploads).
- Unterstützte Dateiformate: JPG/PNG für Bilder, JSON für Templates.

**Starten der App**:
- Öffnen Sie die HTML-Datei in einem Browser. Die Oberfläche lädt automatisch mit einem Header-Menü und einem Canvas-Bereich.

#### 2. Oberfläche und Navigation
Die Hauptoberfläche besteht aus:
- **Header-Menü** (oben): Enthält Icons und Buttons für Kernfunktionen.
  - 🏢 **Explainator - Ultimate Edition**: Titel der App.
  - **Sprachauswahl**: "EN" für Englisch (wechselt zwischen DE/EN).
  - **Menü-Optionen**:
    - 📦 **Neue Box**: Öffnet den Dialog zum Hinzufügen einer neuen Box.
    - 🎨 **Kategorien verwalten**: Öffnet den Kategorien-Manager.
    - 🔠 **Formatierung**: Öffnet den Schriftart-Anpassungsdialog (siehe unten).
    - 📸 **Als PNG exportieren**: Exportiert das Canvas als PNG-Bild.
    - 💾 **Template speichern**: Speichert das aktuelle Layout als Template.
    - 📂 **Template laden**: Lädt ein gespeichertes oder vordefiniertes Template.
    - 🔄 **Layout zurücksetzen**: Setzt das Layout auf Standard zurück.
    - 🗑️ **Alles löschen**: Löscht den gesamten Inhalt.
    - ❓ **Hilfe**: Öffnet den Hilfe-Dialog.
- **Canvas-Bereich**: Der Hauptarbeitsbereich, wo Spalten, Sections und Boxen platziert werden. Unterstützt Drag-and-Drop für Verschieben und Neuanordnen.
- **Modals/Dialoge**: Überlagernde Fenster für spezifische Aktionen (z. B. "Neue Box hinzufügen"). Jeder Modal hat Buttons wie "Hinzufügen", "Abbrechen" oder "Fertig".

**Navigationstipps**:
- Klicken Sie auf Header-Icons, um Modals zu öffnen.
- Ziehen Sie Elemente (Boxen/Sections) mit der Maus, um sie zu verschieben.
- Halten Sie Tastenkombinationen für erweiterte Aktionen (siehe Abschnitt 5).

#### 3. Hauptfunktionen
Hier eine schritt-für-schritt-Beschreibung der Kernfeatures.

##### 3.1 Neue Box hinzufügen (📦)
- **Öffnen**: Klicken auf "Neue Box" im Header.
- **Dialog-Elemente**:
  - **Breite**: Wählen Sie "Volle Breite" oder "Halbe Breite".
  - **Höhe (Zeilen)**: 1 Zeile (Standard), 2 Zeilen oder 3 Zeilen.
  - **Text**: Eingabefeld für den Box-Inhalt.
  - **Bild statt Text**: Checkbox zum Ersetzen des Texts durch ein Bild.
    - **Bild auswählen**: Datei-Upload (JPG/PNG) oder Drag-and-Drop.
    - **Maximale Höhe**: Bis zu 3 × 3-Zeilen-Boxen.
- **Aktionen**:
  1. Füllen Sie die Felder aus.
  2. Klicken Sie auf "Hinzufügen" – die Box erscheint im Canvas.
  3. Oder "Abbrechen" zum Verwerfen.
- **Tipps**: Boxen können später per Drag-and-Drop verschoben werden. In gesplitteten Spalten passen halbe Breiten perfekt.

##### 3.2 Layout Builder
- **Öffnen**: Implizit über "Neue Spalte" (nicht direkt im HTML sichtbar, aber im Hilfe-Text erwähnt).
- **Dialog-Elemente**:
  - **Spalten**: Eingabefeld für die Anzahl der Spalten.
  - **Aktualisieren**: Button zum Anwenden.
- **Aktionen**:
  1. Geben Sie die Spaltenanzahl ein.
  2. Klicken Sie auf "Erstellen" – erstellt neue Spalten im Canvas.
  3. Oder "Abbrechen".
- **Erweiterung**: Spalten können gesplittet werden (2–3 Teile) via Split-Zähler in der Spaltenleiste.

##### 3.3 Kategorien verwalten (🎨)
- **Öffnen**: Klicken auf "Kategorien verwalten".
- **Dialog-Elemente**:
  - **Neue Kategorie hinzufügen**:
    - Name: Eingabefeld.
    - **Box-Farbe**: Farbwähler mit Pipette; Checkbox für Verlauf.
    - **Farbe 2**: Zweite Farbe für Verlauf.
    - **Text-Farbe**: Farbwähler mit Pipette.
    - **Vorschau**: Zeigt eine Live-Vorschau.
    - ➕ **Kategorie hinzufügen**: Fügt die Kategorie hinzu.
  - **Vorhandene Kategorien**: Liste mit Bearbeitungsoptionen.
- **Aktionen**:
  1. Erstellen Sie eine neue Kategorie und wählen Farben.
  2. Klicken Sie auf "Fertig" zum Schließen.
- **Anwendung**: Kategorien werden auf Sections/Boxen angewendet via ⚙/🎨 im Section-Header.

##### 3.4 Schriftart anpassen (🔠)
- **Öffnen**: Klicken auf "Formatierung".
- **Dialog-Elemente**:
  - **Bereich auswählen**: Spalten, Sections oder Boxen.
  - **Schriftart**: Dropdown (Segoe UI (Default), Arial, Times New Roman, Courier New, Verdana, Georgia).
  - **Schriftgröße (px)**: Eingabefeld.
  - **Formatierungen**: Checkboxen für Fett (Bold) und Kursiv (Italic).
- **Aktionen**:
  1. Wählen Sie den Bereich und Einstellungen.
  2. Klicken Sie auf "Anwenden & Schließen".
  3. Oder "Abbrechen".

##### 3.5 Template speichern/laden (💾 / 📂)
- **Speichern**:
  - Öffnet Dialog zum Speichern in Liste und Download als JSON.
- **Laden**:
  - **Vorlagen**: Vordefinierte (Organigramm, Office Map, Kanban).
  - **Gespeicherte Templates**: Liste lokaler Speicherungen.
  - **Template aus Datei laden**: Upload einer JSON-Datei.
- **Aktionen**:
  1. Wählen Sie ein Template.
  2. Klicken Sie auf "Schließen" nach dem Laden.

#### 4. Erweiterte Features
- **Splitten von Spalten**: Nutzen Sie den Split-Zähler (2–3 Teile). Beim Ziehen einer Split-Section: Halten Sie Alt, um als volle Breite abzulegen.
- **Farben und Raster**: ⚙/🎨 für Farben; "Hilfslinien" zeigt Grid-Linien.
- **Bilder**: Nur in Boxen, maximale Größe beachten.
- **Hilfe-Dialog (❓)**: Enthält detaillierte Grundlagen, Speichern/Laden, Export und Tastatur-Tipps (auf DE/EN).

#### 5. Tastaturkürzel und Tipps
- **Alt + Drop**: Split-Section als volle Breite einfügen.
- **Ctrl + Ziehen**: Duplizieren (falls aktiviert).
- **Allgemein**: Drag-and-Drop für alle Elemente; "Neue Spalte" im Kopfbereich für Erweiterung.
- **Tipps aus Hilfe**: Nutzen Sie Raster für Ausrichtung; Export bereinigt Rahmen/Icons.

---

## User Manual (English)

#### 1. Introduction
Explainator is a web-based application for creating and editing visual layouts. It supports:
- **Organizational Charts** (Hierarchical structures, e.g., company organizations).
- **Office Maps** (Floor plans or office layouts).
- **Kanban Boards** (Task management with columns).
- **Other Canvas-Based Content** (e.g., custom boards).

The app is multilingual (German and English) and features an intuitive drag-and-drop interface. It does not load external resources (except potentially user images) and saves data locally or as JSON files. The HTML structure suggests a Single-Page Application (SPA) with modals for dialogs and a main canvas area.

**System Requirements**:
- Modern web browser (e.g., Chrome, Firefox).
- No internet connection required (except for local file uploads).
- Supported file formats: JPG/PNG for images, JSON for templates.

**Starting the App**:
- Open the HTML file in a browser. The interface loads automatically with a header menu and a canvas area.

#### 2. Interface and Navigation
The main interface consists of:
- **Header Menu** (top): Contains icons and buttons for core functions.
  - 🏢 **Explainator - Ultimate Edition**: Title of the app.
  - **Language Selection**: "EN" for English (switches between DE/EN).
  - **Menu Options**:
    - 📦 **New Box**: Opens the dialog to add a new box.
    - 🎨 **Manage Categories**: Opens the category manager.
    - 🔠 **Formatting**: Opens the font customization dialog (see below).
    - 📸 **Export as PNG**: Exports the canvas as a PNG image.
    - 💾 **Save Template**: Saves the current layout as a template.
    - 📂 **Load Template**: Loads a saved or predefined template.
    - 🔄 **Reset Layout**: Resets the layout to default.
    - 🗑️ **Clear All**: Deletes all content.
    - ❓ **Help**: Opens the help dialog.
- **Canvas Area**: The main workspace where columns, sections, and boxes are placed. Supports drag-and-drop for moving and rearranging.
- **Modals/Dialogs**: Overlay windows for specific actions (e.g., "Add New Box"). Each modal has buttons like "Add", "Cancel", or "Done".

**Navigation Tips**:
- Click on header icons to open modals.
- Drag elements (boxes/sections) with the mouse to move them.
- Hold down key combinations for advanced actions (see section 5).

#### 3. Main Features
Here is a step-by-step description of the core features.

##### 3.1 Add New Box (📦)
- **Open**: Click on "New Box" in the header.
- **Dialog Elements**:
  - **Width**: Choose "Full Width" or "Half Width".
  - **Height (Lines)**: 1 line (default), 2 lines, or 3 lines.
  - **Text**: Input field for the box content.
  - **Image instead of Text**: Checkbox to replace text with an image.
    - **Select Image**: File upload (JPG/PNG) or drag-and-drop.
    - **Maximum Height**: Up to 3 × 3-line boxes.
- **Actions**:
  1. Fill in the fields.
  2. Click "Add" – the box appears on the canvas.
  3. Or "Cancel" to discard.
- **Tips**: Boxes can be moved later via drag-and-drop. In split columns, half-widths fit perfectly.

##### 3.2 Layout Builder
- **Open**: Implicitly via "New Column" (not directly visible in HTML, but mentioned in the help text).
- **Dialog Elements**:
  - **Columns**: Input field for the number of columns.
  - **Update**: Button to apply.
- **Actions**:
  1. Enter the number of columns.
  2. Click "Create" – creates new columns on the canvas.
  3. Or "Cancel".
- **Extension**: Columns can be split (2–3 parts) via the split counter in the column bar.

##### 3.3 Manage Categories (🎨)
- **Open**: Click on "Manage Categories".
- **Dialog Elements**:
  - **Add New Category**:
    - Name: Input field.
    - **Box Color**: Color picker with eyedropper; checkbox for gradient.
    - **Color 2**: Second color for gradient.
    - **Text Color**: Color picker with eyedropper.
    - **Preview**: Shows a live preview.
    - ➕ **Add Category**: Adds the category.
  - **Existing Categories**: List with editing options.
- **Actions**:
  1. Create a new category and choose colors.
  2. Click "Done" to close.
- **Application**: Categories are applied to sections/boxes via ⚙/🎨 in the section header.

##### 3.4 Customize Font (🔠)
- **Open**: Click on "Formatting".
- **Dialog Elements**:
  - **Select Area**: Columns, Sections, or Boxes.
  - **Font**: Dropdown (Segoe UI (Default), Arial, Times New Roman, Courier New, Verdana, Georgia).
  - **Font Size (px)**: Input field.
  - **Formatting**: Checkboxes for Bold and Italic.
- **Actions**:
  1. Select the area and settings.
  2. Click "Apply & Close".
  3. Or "Cancel".

##### 3.5 Save/Load Template (💾 / 📂)
- **Save**:
  - Opens a dialog to save to a list and download as JSON.
- **Load**:
  - **Templates**: Predefined (Organizational Chart, Office Map, Kanban).
  - **Saved Templates**: List of local saves.
  - **Load Template from File**: Upload a JSON file.
- **Actions**:
  1. Select a template.
  2. Click "Close" after loading.

#### 4. Advanced Features
- **Splitting Columns**: Use the split counter (2–3 parts). When dragging a split section: Hold Alt to drop it as full-width.
- **Colors and Grid**: ⚙/🎨 for colors; "Grid Lines" shows grid lines.
- **Images**: Only in boxes, note the maximum size.
- **Help Dialog (❓)**: Contains detailed basics, save/load, export, and keyboard tips (in DE/EN).

#### 5. Keyboard Shortcuts and Tips
- **Alt + Drop**: Insert a split section as full-width.
- **Ctrl + Drag**: Duplicate (if enabled).
- **General**: Drag-and-drop for all elements; "New Column" in the header for expansion.
- **Tips from Help**: Use the grid for alignment; export cleans up borders/icons.