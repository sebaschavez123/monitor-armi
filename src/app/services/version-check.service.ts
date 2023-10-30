
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '../core/storage';

@Injectable({
    providedIn: 'root'
  })
export class VersionCheckService {
    // this will be replaced by actual hash post-build.js
    private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
    hashChanged:boolean = false;

    constructor() {}

    /**
     * Checks in every set frequency the version of frontend application
     * @param url
     * @param {number} frequency - in milliseconds, defaults to 30 minutes
     */
    public initVersionCheck() {
        this.checkVersion();
    }

    /**
     * Will do the call and check if the hash has changed or not
     * @param url
     */
    private checkVersion() {
        // timestamp these requests to invalidate caches
        const hash = Storage.check("hash") ? Storage.getOne("hash") : "";
        const hashChanged = this.hasHashChanged(this.currentHash, hash);
        // If new version, do something
        if (hashChanged) {
            // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
            Storage.setAll('hash', this.currentHash);
            this.hashChanged = hashChanged;
            // location.reload();
        }
        // store the new hash so we wouldn't trigger versionChange again
        // only necessary in case you did not force refresh
        this.currentHash = hash;
    }

    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     * @param currentHash
     * @param newHash
     * @returns {boolean}
     */
    private hasHashChanged(currentHash, newHash) {
        if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
            return false;
        }

        return currentHash !== newHash;
    }
}