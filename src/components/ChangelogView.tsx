import { Action, ActionPanel, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import ModChangelogAPIResponse from "../models/ModChangelogAPIResponse";
import { modrinthIcons } from "../utils/constants";
import { timeAgo } from "../utils/functions";
import ChangelogItemView from "./ChangelogItemView";

interface ChangelogViewProps {
  slug: string
}

export default function ChangelogView({ slug }: ChangelogViewProps): JSX.Element {
  const { data, isLoading } = useFetch<ModChangelogAPIResponse[]>(
    `https://api.modrinth.com/v2/project/${slug}/version`,
  );

  return (
    <List isLoading={isLoading}>
      <List.Section title={"All Versions"} subtitle={data?.length.toString()}>
        {data?.map((item) => {
          return <List.Item
            key={item.id}
            title={item.name}
            subtitle={`Released ${timeAgo(item.date_published)}`}
            icon={modrinthIcons.get(item.loaders[0])}
            actions={
            <ActionPanel>
              <Action.Push title={"View Details"} target={<ChangelogItemView data={item} slug={slug} />} />
            </ActionPanel>
            } />;
        })}
      </List.Section>
    </List>
  );
}