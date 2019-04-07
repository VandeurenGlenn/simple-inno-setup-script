const groupDescription = 'GroupDescription: "{cm:AdditionalIcons}"';
let icons = '';

const desktopIcon = name => `Name: "{userdesktop}\\${name}"; Filename: "{pf}/${name}/${name}.vbs";\n`;

const quickLaunchIcon = name => `Name: "{group}\\${name}"; Filename: "{pf}/${name}/${name}.exe";\nName: "{group}\\{cm:UninstallProgram,'${name}'}"; Filename: "{uninstallexe}";`

const sourceDir = (source, name) => `Source: "${source}"; DestDir: "{pf}/${name}"; DestName: "${name}.exe";`
// one needs to be a function, so let's make all of them one...
export default {
  desktopIcon: name => {
    icons += desktopIcon(name);
    return `Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; ${groupDescription}; Flags: checkablealone`;
  },
  quickLaunchIcon: name => {
    icons += quickLaunchIcon(name);
    return `Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; ${groupDescription}; Flags: unchecked; OnlyBelowVersion: 0,6.1`
  },
  runAfterInstall: name => `Filename: "{userdesktop}\\${name}.lnk"; Flags: nowait skipifsilent runascurrentuser shellexec; Description: "{cm:LaunchProgram,{#StringChange('${name}', '&', '&&')}}"`,
  sourceDir: (source, name, destdir) => `${sourceDir(source, name)} Check: Is64BitInstallMode`,
  sourceDirX86: (source, name, destdir) => `${sourceDir(source, name)} Check: not Is64BitInstallMode; Flags: solidbreak`,
  icons: () => icons
}
