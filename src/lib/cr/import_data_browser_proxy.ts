// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// clang-format off
import {sendWithPromise} from './cr.js';
// clang-format on

/**
 * An object describing a source browser profile that may be imported.
 * The structure of this data must be kept in sync with C++ ImportDataHandler.
 */
export interface BrowserProfile {
  name: string;
  index: number;
  profileName: string;
  history: boolean;
  favorites: boolean;
  passwords: boolean;
  search: boolean;
  autofillFormData: boolean;
  extensions: boolean;
}

/**
 * These string values must be kept in sync with the C++ ImportDataHandler.
 */
export enum ImportDataStatus {
  INITIAL = 'initial',
  IN_PROGRESS = 'inProgress',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export type WhatToImport = {
  import_dialog_autofill_form_data: boolean,
  import_dialog_bookmarks: boolean,
  import_dialog_history: boolean,
  import_dialog_saved_passwords: boolean,
  import_dialog_search_engine: boolean,
  import_dialog_extensions: boolean
};

export interface ImportDataBrowserProxy {
  /**
   * Returns the source profiles available for importing from other browsers.
   */
  initializeImportDialog(): Promise<BrowserProfile[]>;

  /**
   * Starts importing data for the specified source browser profile. The C++
   * responds with the 'import-data-status-changed' WebUIListener event.
   * @param types Which types of data to import.
   */
  importData(
      sourceBrowserProfileIndex: number,
      types: WhatToImport): void;

  /**
   * Prompts the user to choose a bookmarks file to import bookmarks from.
   */
  importFromBookmarksFile(): void;
}

export class ImportDataBrowserProxyImpl implements ImportDataBrowserProxy {
  initializeImportDialog() {
    return sendWithPromise('initializeImportDialog');
  }

  importData(
      sourceBrowserProfileIndex: number, types: {[type: string]: boolean}) {
    chrome.send('importData', [sourceBrowserProfileIndex, types]);
  }

  importFromBookmarksFile() {
    chrome.send('importFromBookmarksFile');
  }

  static getInstance(): ImportDataBrowserProxy {
    return instance || (instance = new ImportDataBrowserProxyImpl());
  }

  static setInstance(obj: ImportDataBrowserProxy) {
    instance = obj;
  }
}

let instance: ImportDataBrowserProxy|null = null;
