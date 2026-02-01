import { readonly, writable } from 'svelte/store';
import * as cr from '../cr';

export type InstallError = {
    error: string;
    code: WebstoreInstallErrorCode;
};

export type InstallResponse =
    | { success: true }
    | { success: false } & InstallError;

const update = (diff: ExtensionStatus) =>
    _extensionStatus.update((data) => Object.assign(data, diff));

const _extensionStatus = writable<ExtensionStatus>({});

cr.sendWithPromise('getExtensions').then(update);
cr.addWebUiListener('extension-state-changed', update);

function intoInstallError(value: unknown): InstallError | undefined {
    if (
        typeof value === 'object' &&
        value !== null &&
        'error' in value &&
        'code' in value &&
        typeof value.error === 'string' &&
        typeof value.code === 'number' &&
        value.code > 0 && value.code <= WebstoreInstallErrorCode.Max
    ) {
        return {
            error: value.error,
            code: value.code,
        };
    }
}

//chrome/common/extensions/webstore_install_result.h
export enum WebstoreInstallErrorCode {
    OtherError = 1,
    Aborted,
    InstallInProgress,
    NotPermitted,
    InvalidId,
    WebstoreRequestError,
    InvalidWebstoreResponse,
    InvalidManifest,
    IconError,
    UserCancelled,
    Blocklisted,
    MissingDependencies,
    RequirementViolations,
    BlockedByPolicy,
    LaunchFeatureDisabled,
    LaunchUnsupportedExtensionType,
    LaunchInProgress,
    Max = LaunchInProgress,
}

export type ExtensionStatus = Record<string, boolean>;
export const installExtension = async (
    id: string,
): Promise<InstallResponse> => {
    try {
        await cr.sendWithPromise('installExtension', id);
        return { success: true };
    } catch (err) {
        let installError: InstallError | undefined;
        if (installError = intoInstallError(err)) {
            return { success: false, ...installError };
        }

        throw err;
    }
};

export const extensionStatus = readonly(_extensionStatus);
