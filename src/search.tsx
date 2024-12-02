import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import ModListType from "./models/ModListType";
import { timeAgo } from "./utils/functions";
import { modloaders, newlinePlaceholder } from "./utils/constants";
import ModItemType from "./models/ModItemType";
import { NodeHtmlMarkdown } from "node-html-markdown";

interface ListAPIResponse {
  hits: ModListType[];
}

export default function Command() {
  const nhm = new NodeHtmlMarkdown();
  const [searchText, setSearchText] = useState("");
  const [itemId, setItemId] = useState("");
  const listDataSearchParams = new URLSearchParams({
    query: searchText,
    facets: '[["project_type:mod"]]',
    limit: '50',
  }).toString();

  const { data: listData, isLoading: listDataIsLoading } = useFetch<ListAPIResponse>(
    `https://api.modrinth.com/v2/search?${listDataSearchParams}`
  );

  const {data: itemData, isLoading: itemDataIsLoading, error: itemDataError } = useFetch<ModItemType>(
    `https://api.modrinth.com/v2/project/${itemId}`
  )

  return (
    <List
      isShowingDetail
      searchText={searchText}
      searchBarPlaceholder={"Search for mods..."}
      throttle={true}
      onSearchTextChange={(text) => {
        setSearchText(text);
      }}
      isLoading={listDataIsLoading}
      onSelectionChange={(selection) => {
        setItemId(selection ? selection : "")
      }}
    >
      <List.Section title={"Results"} subtitle={listData?.hits.length.toString()}>
        {listData?.hits?.map((item: ModListType) => (
          <List.Item
            key={item.project_id}
            icon={item.icon_url}
            subtitle={item.versions.filter((str) => !/[a-zA-Z]/.test(str)).at(-1)}
            title={item.title}
            id={item.project_id}
            actions={
            <ActionPanel>
              <Action title={"Print Body to Console"} onAction={() => console.log(itemData?.body)}  />
            </ActionPanel>
            }
            detail={
              <List.Item.Detail
                isLoading={itemDataIsLoading}
                markdown={(itemDataIsLoading || itemDataError) ? "Loading..." : nhm.translate(itemData!.body.replaceAll('\n', newlinePlaceholder)).replaceAll(newlinePlaceholder, "\n").replace(/\\/g, "")}
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Link title={"Author"} text={item.author} target={`https://modrinth.com/user/${item.author}`} />
                    <List.Item.Detail.Metadata.Label title={"Description"} text={item.description} />
                    <List.Item.Detail.Metadata.Label title={"Downloads"} text={item.downloads.toLocaleString()} />
                    <List.Item.Detail.Metadata.Label title={"Last Updated"} text={timeAgo(item.date_modified)} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.TagList title={"Supported Platforms"} children={
                      item.display_categories.filter(curr => Array.from(modloaders.keys()).includes(curr)).map(curr => {
                        return <List.Item.Detail.Metadata.TagList.Item text={curr.charAt(0).toUpperCase() + curr.slice(1)} color={modloaders.get(curr)} />
                      })
                        }
                    />
                  </List.Item.Detail.Metadata>
                }
              />
            }
          />
        )) || <List.Item title="Loading..." />}
      </List.Section>
    </List>
  );
}
