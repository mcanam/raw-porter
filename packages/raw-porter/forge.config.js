import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

export const packagerConfig = {
    asar: true,
    icon: './images/icon',
    executableName: 'raw-porter',
};

export const rebuildConfig = {};

export const makers = [
    {
        name: '@electron-forge/maker-squirrel',
        config: {
            authors: 'mcanam',
            description: 'Simple raw file finder',
            iconUrl: '',
            setupIcon: './images/icon.ico',
        },
    },
    {
        name: '@electron-forge/maker-dmg',
        config: {
            format: 'ULFO',
            icon: './images/icon.icns',
        },
    },
];
export const plugins = [
    {
        name: '@electron-forge/plugin-auto-unpack-natives',
        config: {},
    },
    new FusesPlugin({
        version: FuseVersion.V1,
        [FuseV1Options.RunAsNode]: false,
        [FuseV1Options.EnableCookieEncryption]: true,
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
        [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
];

// npx electron-forge make --platform=win32 --arch=x64 --targets=@electron-forge/maker-squirrel
