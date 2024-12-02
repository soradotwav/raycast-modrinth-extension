import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { modrinthIcons, modrinthColors, newlinePlaceholder } from "../utils/constants";
import ModItemType from "../models/ModItemType";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { formatMinecraftVersions } from "../utils/functions";
import ChangelogView from "./ChangelogView";

interface DetailViewProps {
  itemData: ModItemType | null;
  nhm: NodeHtmlMarkdown;
}

export default function DetailView({ itemData, nhm }: DetailViewProps) {
  return (
    <Detail
      isLoading={itemData == null}
      navigationTitle={`Details for ${itemData?.title ?? "Current Mod"}`}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={`https://modrinth.com/mod/${itemData?.slug ?? ""}`} />
          <Action.Push title={"View All Versions"} icon={Icon.BulletPoints} target={<ChangelogView slug={itemData?.slug ?? ""} />} />
        </ActionPanel>
      }
      markdown={
        !itemData || !itemData.body
          ? ""
          : nhm
              .translate(itemData!.body.replaceAll("\n", newlinePlaceholder))
              .replaceAll(newlinePlaceholder, "\n")
              .replace(/\\/g, "")
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title={"Compatible Versions"} children={formatMinecraftVersions(itemData?.game_versions ?? []).map((curr) => {
            return (
              <Detail.Metadata.TagList.Item
                text={curr}
                color={modrinthColors.get("default")}
                key={curr}
              />
            )
          })}/>
          <Detail.Metadata.TagList
            title={"Platforms"}
            children={itemData?.loaders
              .filter((curr) => Array.from(modrinthColors.keys()).includes(curr))
              .map((curr) => {
                return (
                  <Detail.Metadata.TagList.Item
                    text={curr.charAt(0).toUpperCase() + curr.slice(1)}
                    color={modrinthColors.get(curr)}
                    key={curr}
                    icon={{ source: modrinthIcons.get(curr) as string, tintColor: modrinthColors.get(curr) }}
                  />
                );
              })}
          />
          <Detail.Metadata.TagList title="Supported Environments">
            {itemData?.client_side !== "unsupported" && itemData?.client_side !== "unknown" && (
              <Detail.Metadata.TagList.Item
                text="Client-side"
                icon={{ source: "client_side_icon.svg", tintColor: modrinthColors.get("default") }}
                color={modrinthColors.get("default")}
              />
            )}
            {itemData?.server_side !== "unsupported" && itemData?.client_side !== "unknown" && (
              <Detail.Metadata.TagList.Item
                text="Server-side"
                icon={{ source: "server_side_icon.svg", tintColor: modrinthColors.get("default") }}
                color={modrinthColors.get("default")}
              />
            )}
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title={"Downloads"} text={(itemData?.downloads ?? -1).toLocaleString()} />
          <Detail.Metadata.Label title={"Followers"} text={(itemData?.followers ?? -1).toLocaleString()} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link title={""} text={"Report Issues"} target={itemData?.issues_url ?? ""} />
          <Detail.Metadata.Link title={""} text={"View Source"} target={itemData?.source_url ?? ""} />
          <Detail.Metadata.Link title={""} text={"Join the Discord Server"} target={itemData?.discord_url ?? ""} />
        </Detail.Metadata>
      }
    />
  );
}