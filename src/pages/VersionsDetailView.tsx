import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import ModChangelogAPIResponse from "../models/ModChangelogAPIResponse";
import { modrinthColors } from "../utils/constants";

export default function VersionsDetailView(props: {
  data: ModChangelogAPIResponse;
  slug: string;
}) {
  return (
    <Detail
      markdown={`# Changelog\n${props.data.changelog.length === 0 ? "No changelog specified." : props.data.changelog}`}
      navigationTitle={`Details for ${props.data.name}`}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            url={`https://modrinth.com/mod/${props.slug}/version/${props.data.id}`}
          />
          <Action.OpenInBrowser
            title={"Download File"}
            url={props.data.files.find((curr) => curr.primary)?.url
              ?? `https://modrinth.com/mod/${props.slug}/version/${props.data.id}`}
            icon={Icon.Download}
          />
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title={"Release Channel"}
            text={props.data.version_type.charAt(0).toUpperCase() + props.data.version_type.slice(1)}
          />
          <Detail.Metadata.Label
            title={"Version Number"}
            text={props.data.version_number.toString()}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.TagList
            title={"Platforms"}
            children={props.data.loaders.map((curr) => (
              <Detail.Metadata.TagList.Item
                text={curr.charAt(0).toUpperCase() + curr.slice(1)}
                icon={{ source:`${curr}.svg`, tintColor: modrinthColors.get(curr) }}
                color={modrinthColors.get(curr)}
                key={curr}
              />
            ))}
          />
          <Detail.Metadata.TagList
            title={"Game Versions"}
            children={props.data.game_versions.map((curr) => (
              <Detail.Metadata.TagList.Item
                text={curr}
                key={curr}
              />
            ))}
          />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label
            title={"Downloads"}
            text={(props.data.downloads as number).toLocaleString()}
          />
          <Detail.Metadata.Label
            title={"Publication Date"}
            text={new Date(props.data.date_published).toLocaleString()}
          />
        </Detail.Metadata>
      }
    />
  );
}
