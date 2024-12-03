import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import ModChangelogAPIResponse from "../models/ModChangelogAPIResponse";
import { modloaderDropdown, vanillaDropdown } from "../utils/constants";
import { timeAgo } from "../utils/functions";
import VersionsDetailView from "./VersionsDetailView";
import { useState } from "react";
import ListDropdown from "../components/ListDropdown";

export default function VersionsListView(props: {
  slug: string;
  name: string;
  loaders: string[];
  showDropdown: boolean;
}) {
  const { data, isLoading } = useFetch<ModChangelogAPIResponse[]>(
    `https://api.modrinth.com/v2/project/${props.slug}/version`
  );
  const [filter, setFilter] = useState("all-loaders");
  const filteredData = data?.filter((curr) =>
    curr.loaders.includes(filter) || filter === 'all-loaders'
  );

  const dropdownOptions = modloaderDropdown.filter((curr) => props.loaders.includes(curr.id));

  return (
    <List
      searchBarPlaceholder={"Search for a specific Version..."}
      navigationTitle={`Browsing Versions of ${props.name}`}
      isLoading={isLoading}
      searchBarAccessory={
        (props.showDropdown) ?
          <ListDropdown
          onDropdownChange={setFilter}
          dropdownChoiceTypes={dropdownOptions}
          title={"Modloaders"}
          tooltip={"Filter by Modloaders..."}
          defaultValue={"all-loaders"}
          showAll={dropdownOptions.length >= 2}
          customSection={
            <List.Dropdown.Section title={"Server APIs"}>
              {vanillaDropdown.filter((curr) => props.loaders.includes(curr.id)).map((choiceType) => (
                <List.Dropdown.Item
                  key={choiceType.id}
                  value={choiceType.id}
                  title={choiceType.name}
                />
              ))}
            </List.Dropdown.Section>}
        /> : null
      }
    >
      <List.Section
        title={modloaderDropdown.find((val) => val.id === filter)?.name ?? "All"}
        subtitle={filteredData?.length.toString() ?? "-1"}
      >
        {(filteredData ?? []).map((item) => (
          <List.Item
            key={item.id}
            title={item.name}
            subtitle={`Released ${timeAgo(item.date_published)}`}
            icon={{source: `${item.loaders[0]}.svg`, tintColor: "raycast-secondary-text"}}
            actions={
              <ActionPanel>
                <Action.Push
                  title={"View Details"}
                  icon={Icon.Info}
                  target={<VersionsDetailView data={item} slug={props.slug} />}
                />
                <Action.OpenInBrowser
                  url={`https://modrinth.com/mod/${props.slug}/version/${item.id}`}
                />
                <Action.OpenInBrowser
                  title={"Download File"}
                  url={item.files.find((curr) => curr.primary)?.url
                    ?? `https://modrinth.com/mod/${props.slug}/version/${item.id}`}
                  icon={Icon.Download}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}