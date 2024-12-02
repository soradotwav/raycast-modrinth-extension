import { Action, ActionPanel, List } from "@raycast/api";
import ModListType from "../models/ModListType";
import {
  modrinthIcons,
  modrinthColors,
  newlinePlaceholder,
  projectDropdown
} from "../utils/constants";
import { timeAgo } from "../utils/functions";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { useState } from "react";
import { useFetch } from "@raycast/utils";
import ModItemType from "../models/ModItemType";
import { ListAPIResponse } from "../models/ListAPIResponse";
import DetailView from "./DetailView";
import ListViewDropdown from "./ListViewDropdown";

export default function ListView() {
  const nhm = new NodeHtmlMarkdown();
  const [searchText, setSearchText] = useState("");
  const [itemId, setItemId] = useState("");
  const listDataSearchParams = new URLSearchParams({
    query: searchText,
    facets: '[["project_type:mod"]]',
    limit: "50",
  }).toString();

  const { data: listData, isLoading: listDataIsLoading, revalidate: revalidateList } = useFetch<ListAPIResponse>(
    `https://api.modrinth.com/v2/search?${listDataSearchParams}`,
  );

  const {
    data: itemData,
    isLoading: itemDataIsLoading,
    error: itemDataError,
    revalidate: revalidateItem,
  } = useFetch<ModItemType>(`https://api.modrinth.com/v2/project/${itemId}`);

  return (
    <List
      isShowingDetail
      searchText={searchText}
      searchBarPlaceholder={"Search for mods..."}
      throttle={true}
      onSearchTextChange={(text) => {
        setSearchText(text);
        revalidateList();
      }}
      isLoading={listDataIsLoading}
      onSelectionChange={(selection) => {
        setItemId(selection ? selection : "");
        revalidateItem();
      }}
      searchBarAccessory={
      <ListViewDropdown
        onDropdownChange={(val) => console.log(val)}
        title={"Project Types"}
        dropdownChoiceTypes={projectDropdown}
        tooltip={"Select project type..."}
        defaultValue={"all-projects"}
      />
    }
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
                <Action.Push title={"View Details"} target={<DetailView itemData={itemData ?? null} nhm={nhm} />}/>
              </ActionPanel>
            }
            detail={
              <List.Item.Detail
                isLoading={itemDataIsLoading}
                markdown={
                  itemDataIsLoading || itemDataError || !itemData || !itemData.body
                    ? ""
                    : nhm
                        .translate(itemData?.body.replaceAll("\n", newlinePlaceholder) ?? "")
                        .replaceAll(newlinePlaceholder, "\n")
                        .replace(/\\/g, "")
                }
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Link
                      title={"Author"}
                      text={item.author}
                      target={`https://modrinth.com/user/${item.author}`}
                    />
                    <List.Item.Detail.Metadata.Label title={"Description"} text={item.description} />
                    <List.Item.Detail.Metadata.Label title={"Downloads"} text={item.downloads.toLocaleString()} />
                    <List.Item.Detail.Metadata.Label title={"Last Updated"} text={timeAgo(item.date_modified)} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.TagList
                      title={"Platforms"}
                      children={item.display_categories
                        .filter((curr) => Array.from(modrinthColors.keys()).includes(curr))
                        .map((curr) => {
                          return (
                            <List.Item.Detail.Metadata.TagList.Item
                              text={curr.charAt(0).toUpperCase() + curr.slice(1)}
                              color={modrinthColors.get(curr)}
                              key={curr}
                              icon={{source: modrinthIcons.get(curr) as string, tintColor: modrinthColors.get(curr)}}
                            />
                          );
                        })}
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