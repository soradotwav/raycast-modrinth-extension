import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import ModChangelogAPIResponse from "../models/ModChangelogAPIResponse";
import { modloaderDropdown, modrinthIcons } from "../utils/constants";
import { timeAgo } from "../utils/functions";
import ChangelogItemView from "./ChangelogItemView";
import { useState } from "react";
import ListViewDropdown from "./ListViewDropdown";

export default function ChangelogView(props: { slug: string, name: string }) {
  const { data, isLoading } = useFetch<ModChangelogAPIResponse[]>(
    `https://api.modrinth.com/v2/project/${props.slug}/version`,
  );
  const [ filter, setFilter ] = useState("all-loaders");
  const filteredData = data?.filter((curr) => curr.loaders.includes(filter) || filter == 'all-loaders')

  return (
    <List searchBarPlaceholder={"Search for a specific Version..."} navigationTitle={`Browsing Versions of ${props.name}`} isLoading={isLoading} searchBarAccessory={<ListViewDropdown onDropdownChange={setFilter} dropdownChoiceTypes={modloaderDropdown} title={"Modloaders"} tooltip={"Filter by loaders..."} defaultValue={"all-loaders"} />}>
      <List.Section title={modloaderDropdown.find((val) => val.id == filter)?.name ?? "All"} subtitle={filteredData?.length.toString() ?? "-1"}>
        {(filteredData ?? []).map((item) => {
          return <List.Item
            key={item.id}
            title={item.name}
            subtitle={`Released ${timeAgo(item.date_published)}`}
            icon={modrinthIcons.get(item.loaders[0])}
            actions={
            <ActionPanel>
              <Action.Push title={"View Details"} icon={Icon.Info} target={<ChangelogItemView data={item} slug={props.slug} />} />
              <Action.OpenInBrowser url={`https://modrinth.com/mod/${props.slug}/version/${item.id}`} />
              <Action.OpenInBrowser
                title={"Download File"}
                url={item.files.find((curr) => curr.primary)?.url
                  ?? `https://modrinth.com/mod/${props.slug}/version/${item.id}`}
              icon={Icon.Download}
              />
            </ActionPanel>
            } />;
        })}
      </List.Section>
    </List>
  );
}