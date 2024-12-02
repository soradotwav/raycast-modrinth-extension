import { Action, ActionPanel, Detail } from "@raycast/api";
import ModChangelogAPIResponse from "../models/ModChangelogAPIResponse";
import { modrinthColors, modrinthIcons } from "../utils/constants";

interface ChangelogItemViewProps {
  data: ModChangelogAPIResponse
  slug: string;
}

export default function ChangelogItemView({data, slug}: ChangelogItemViewProps) {
  return (
    <Detail markdown={`# Changelog\n${data.changelog.length == 0 ? "No changelog specified." : data.changelog}`}
            navigationTitle={`Details for Changelog ${data.name}`}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={`https://modrinth.com/mod/${slug}/version/${data.id}`} />
                <Action.OpenInBrowser
                  title={"Download File"}
                  url={data.files.find((curr) => curr.primary)?.url
                    ?? `https://modrinth.com/mod/${slug}/version/${data.id}`} />
              </ActionPanel>
            }
            metadata={
              <Detail.Metadata>
                <Detail.Metadata.Label title={"Release Channel"} text={data.version_type.charAt(0).toUpperCase() + data.version_type.slice(1)} />
                <Detail.Metadata.Label title={"Version Number"} text={data.version_number.toString()} />
                <Detail.Metadata.Separator />
                <Detail.Metadata.TagList title={"Loaders"} children={data.loaders.map((curr) => {
                  return <Detail.Metadata.TagList.Item text={curr.charAt(0).toUpperCase() + curr.slice(1)} icon={{source: modrinthIcons.get(curr) as string, tintColor: modrinthColors.get(curr)}} color={modrinthColors.get(curr)} key={curr}/>
                })} />
                <Detail.Metadata.TagList title={"Game Versions"} children={data.game_versions.map((curr) => {
                  return <Detail.Metadata.TagList.Item text={curr} key={curr}/>
                })} />
                <Detail.Metadata.Separator />
                <Detail.Metadata.Label title={"Downloads"} text={(data.downloads as number).toLocaleString()} />
                <Detail.Metadata.Label title={"Publication Date"} text={new Date(data.date_published).toLocaleString()} />
              </Detail.Metadata>
            }
    />
  );
}