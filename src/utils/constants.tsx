import DropdownType from "../models/DropdownType";

export const modrinthColors: Map<string, string> = new Map([
  ["fabric", "#DBB69C"],
  ["quilt", "#C696F9"],
  ["forge", "#959EEF"],
  ["neoforge", "#F99E6B"],
  ["default", '#96A2B0']
])

export const modrinthIcons: Map<string, string> = new Map([
  ["fabric", "fabric_icon.svg"],
  ["quilt", "quilt_icon.svg"],
  ["forge", "forge_icon.svg"],
  ["neoforge", "neoforge_icon.svg"],
  ["client_side", "client_side_icon.svg"],
  ["server_side", "server_side_icon.svg"],
])

export const modloaderDropdown: DropdownType[] = [
  { name: "All Loaders", id: "all-loaders" },
  { name: "Fabric", id: "fabric" },
  { name: "Forge", id: "forge" },
  { name: "Neoforge", id: "neoforge" },
  { name: "Quilt", id: "quilt" },
];

export const projectDropdown: DropdownType[] = [
  { name: "All Projects", id: "all-projects" },
  { name: "Data Packs", id: "data-packs" },
  { name: "Mods", id: "mods" },
  { name: "Modpacks", id: "modpacks" },
  { name: "Plugins", id: "plugins" },
  { name: "Resource Packs", id: "resource-packs" },
  { name: "Shaders", id: "shaders" },
];


export const newlinePlaceholder= "!NEWLINEPLACEHOLDER!"